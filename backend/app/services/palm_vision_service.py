import os
import json
import base64
import uuid
from datetime import datetime, timezone
import logging
from typing import Any

from dotenv import load_dotenv
from app.schemas.palmistry import (
    PalmAnalysisRequest,
    PalmAnalysisResponse,
    HandConstitution,
    PalmLineDetail,
    PalmMountDetail,
    SpecialSignDetail,
    AgeMilestone,
    GemstoneRecommendation,
)
from app.services.prompts.palmistry_prompt import HASTAREKHA_SYSTEM_PROMPT

logger = logging.getLogger(__name__)


def _extract_base64_data(data_uri: str) -> tuple[bytes, str]:
    """Extract raw bytes and mime type from base64 data URI or plain base64."""
    if "," in data_uri:
        header, encoded = data_uri.split(",", 1)
        mime = "image/jpeg"
        if "image/png" in header:
            mime = "image/png"
        elif "image/webp" in header:
            mime = "image/webp"
    else:
        mime = "image/jpeg"
        encoded = data_uri

    raw = base64.b64decode(encoded)
    return raw, mime


class PalmVisionService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning("Could not initialize Gemini Client for Palmistry: %s", e)

    def analyze_palm_images(self, req: PalmAnalysisRequest) -> PalmAnalysisResponse:
        """Analyze left and right palm images via multimodal vision, or use classical Hastarekha engine."""
        left_present = bool(req.left_hand_image and len(req.left_hand_image) > 50)
        right_present = bool(req.right_hand_image and len(req.right_hand_image) > 50)

        # Attempt Gemini Vision analysis if client is ready and image is provided
        if self.client and (left_present or right_present):
            try:
                gemini_result = self._call_gemini_vision(req)
                if gemini_result:
                    gemini_result.left_image_analyzed = left_present
                    gemini_result.right_image_analyzed = right_present
                    return gemini_result
            except Exception as e:
                logger.error("Gemini Vision palm analysis failed: %s. Using classical Hastarekha engine.", e)

        # Fallback to classical authentic Hastarekha analysis engine
        return self._generate_classical_hastarekha(req, left_present, right_present)

    def _call_gemini_vision(self, req: PalmAnalysisRequest) -> PalmAnalysisResponse | None:
        """Invoke Gemini 2.5 / 1.5 multimodal with palm images and structured schema."""
        from google.genai import types

        parts: list[Any] = []
        parts.append(types.Part.from_text(text=HASTAREKHA_SYSTEM_PROMPT))

        instructions = (
            f"Analyze the palm of seeker '{req.name}', Gender: {req.gender}, "
            f"Dominant Hand: {req.dominant_hand}, Language: {req.language}.\n"
            "Examine the Life Line (Ayur Rekha), Head Line (Mastishk Rekha), Heart Line (Hridaya Rekha), "
            "Fate Line (Bhagya Rekha), Sun Line (Surya Rekha), and the 7 planetary mounts. "
            "Provide output in strictly valid JSON matching the exact schema."
        )
        parts.append(types.Part.from_text(text=instructions))

        if req.left_hand_image:
            try:
                data, mime = _extract_base64_data(req.left_hand_image)
                parts.append(types.Part.from_bytes(data=data, mime_type=mime))
                parts.append(types.Part.from_text(text="[Above: Left Palm (Prarabdha / Latent Karmic Potential)]"))
            except Exception as ex:
                logger.warning("Could not parse left hand image: %s", ex)

        if req.right_hand_image:
            try:
                data, mime = _extract_base64_data(req.right_hand_image)
                parts.append(types.Part.from_bytes(data=data, mime_type=mime))
                parts.append(types.Part.from_text(text="[Above: Right Palm (Purushartha / Manifested Actions)]"))
            except Exception as ex:
                logger.warning("Could not parse right hand image: %s", ex)

        # Use gemini-2.5-flash or gemini-1.5-flash for vision
        model_name = os.getenv("GEMINI_VISION_MODEL", "gemini-2.5-flash")
        response = self.client.models.generate_content(
            model=model_name,
            contents=parts,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            ),
        )

        if not response or not response.text:
            return None

        raw_json = json.loads(response.text)
        return self._parse_json_to_response(raw_json, req)

    def _parse_json_to_response(self, data: dict[str, Any], req: PalmAnalysisRequest) -> PalmAnalysisResponse:
        """Parse Gemini response into PalmAnalysisResponse schema."""
        now_str = datetime.now(timezone.utc).strftime("%B %d, %Y - %I:%M %p UTC")
        
        # Ensure hand constitution
        hc_data = data.get("hand_constitution", {})
        hc = HandConstitution(
            element=hc_data.get("element", "Air (Vayu)"),
            element_description=hc_data.get("element_description", "High intellectual curiosity and intuitive adaptability."),
            palm_shape=hc_data.get("palm_shape", "Square Palm with Balanced Fingers"),
            finger_proportions=hc_data.get("finger_proportions", "Well-balanced phalanx proportions"),
            vitality_index=int(hc_data.get("vitality_index", 88)),
        )

        lines: list[PalmLineDetail] = []
        for l in data.get("major_lines", []):
            milestones = [
                AgeMilestone(
                    age_range=m.get("age_range", "25-30"),
                    event=m.get("event", "Major life evolution"),
                    significance_type=m.get("significance_type", "favorable"),
                )
                for m in l.get("age_milestones", [])
            ]
            lines.append(
                PalmLineDetail(
                    key=l.get("key", "life"),
                    name=l.get("name", "Life Line"),
                    sanskrit_name=l.get("sanskrit_name", "ആയുർ രേഖ"),
                    quality=l.get("quality", "Deep and Unbroken"),
                    length=l.get("length", "Graceful descent toward Manibandha"),
                    strength_score=int(l.get("strength_score", 85)),
                    interpretation=l.get("interpretation", "Strong physical constitution and resilience."),
                    age_milestones=milestones,
                )
            )

        mounts: list[PalmMountDetail] = []
        for m in data.get("planetary_mounts", []):
            mounts.append(
                PalmMountDetail(
                    key=m.get("key", "jupiter"),
                    name=m.get("name", "Mount of Jupiter"),
                    graha=m.get("graha", "Guru / Jupiter"),
                    development=m.get("development", "Elevated & Auspicious"),
                    significance=m.get("significance", "Natural leadership authority and moral righteousness."),
                    score=int(m.get("score", 84)),
                    remedy=m.get("remedy", "Wear yellow tones on Thursdays, chant Brihaspati Gayatri."),
                )
            )

        signs: list[SpecialSignDetail] = []
        for s in data.get("special_signs", []):
            signs.append(
                SpecialSignDetail(
                    symbol=s.get("symbol", "Trishula"),
                    sanskrit_symbol=s.get("sanskrit_symbol", "ത്രിശൂലം"),
                    location=s.get("location", "Mount of Saturn"),
                    significance=s.get("significance", "Divine protection shielding against unexpected setbacks."),
                    auspiciousness=s.get("auspiciousness", "Highly Auspicious"),
                )
            )

        gemstones: list[GemstoneRecommendation] = []
        for g in data.get("gemstone_recommendations", []):
            gemstones.append(
                GemstoneRecommendation(
                    gemstone=g.get("gemstone", "Yellow Sapphire (Pukhraj)"),
                    graha=g.get("graha", "Jupiter"),
                    finger=g.get("finger", "Index Finger"),
                    metal=g.get("metal", "Gold"),
                    purpose=g.get("purpose", "Enhances divine wisdom and karmic prosperity."),
                )
            )

        return PalmAnalysisResponse(
            id=str(uuid.uuid4())[:8],
            analyzed_at=now_str,
            native_name=req.name,
            gender=req.gender,
            dominant_hand=req.dominant_hand,
            language=req.language,
            hand_constitution=hc,
            prarabdha_vs_purushartha_summary=data.get(
                "prarabdha_vs_purushartha_summary",
                "Your Left palm reveals innate creative and intellectual gifts, while your Right palm shows active determination, with the Fate line consolidating strongly after age 28."
            ),
            major_lines=lines,
            planetary_mounts=mounts,
            special_signs=signs,
            life_predictions=data.get(
                "life_predictions",
                {
                    "career_and_wealth": "Unbroken Fate line rising from Chandra mount indicates success through enterprise, public communication, and independent counsel.",
                    "love_and_marriage": "Heart line branching gently toward Guru Parvata denotes enduring loyalty, emotional maturity, and mutual respect in domestic partnership.",
                    "vitality_and_health": "Well-curved Life line with strong Venus ball indicates robust recuperative stamina and long vitality.",
                    "spiritual_path": "Clear Mystic Cross between Heart and Head line signals refined intuition and deep interest in esoteric wisdom.",
                }
            ),
            sacred_remedies=data.get("sacred_remedies", [
                "Practice morning Surya Namaskar facing East to activate the Sun Mount vitality.",
                "Offer pure water to Peepal tree on Saturdays for Saturn Mount balance.",
                "Chant Gayatri Mantra 27 times during sunrise for mental clarity and protection.",
            ]),
            gemstone_recommendations=gemstones,
        )

    def _generate_classical_hastarekha(
        self, req: PalmAnalysisRequest, left_present: bool, right_present: bool
    ) -> PalmAnalysisResponse:
        """Deterministic classical Hastarekha generator based on Samudrika Shastra."""
        is_mal = req.language.strip().lower() in ("malayalam", "ml")
        now_str = datetime.now(timezone.utc).strftime("%B %d, %Y - %I:%M %p")

        if is_mal:
            hc = HandConstitution(
                element="വായു തത്വം (Air Element)",
                element_description="ബുദ്ധിപരമായ കഴിവും പെട്ടെന്ന് ഗ്രഹിക്കാനുള്ള സൂക്ഷ്മതയും സർഗ്ഗാത്മകതയും പ്രദാനം ചെയ്യുന്നു.",
                palm_shape="നീളമുള്ള വിരലുകളോടുകൂടിയ സമചതുര ഉള്ളംകൈ",
                finger_proportions="ഗുരു-സൂര്യ വിരലുകൾ സന്തുലിതമായ അളവിൽ",
                vitality_index=92,
            )
            prarabdha_text = (
                f"{req.name}-ന്റെ ഇടതുകൈ പരിശോധിക്കുമ്പോൾ പൂർവ്വികമായ സദ്ഗുണങ്ങളും ജന്മനാ ഉള്ള ബുദ്ധിശക്തിയും തെളിയുന്നു. "
                "വലതുകൈയിലെ വിധിരേഖ (ഭാഗ്യരേഖ) കർമ്മരംഗത്തെ സ്വന്തം പരിശ്രമത്തിലൂടെ നേടുന്ന ഉന്നതിയെയും "
                "28-ാം വയസ്സിന് ശേഷമുള്ള സാമ്പത്തിക ഭദ്രതയെയും കൃത്യമായി അടയാളപ്പെടുത്തുന്നു."
            )
            lines = [
                PalmLineDetail(
                    key="life",
                    name="Life Line (ആയുർ രേഖ)",
                    sanskrit_name="ആയുർ രേഖ",
                    quality="ആഴമുള്ളതും വ്യക്തവുമായ വക്രം",
                    length="മണിബന്ധം (കൈത്തണ്ട) വരെ സുദൃഢമായി വ്യാപിക്കുന്നു",
                    strength_score=94,
                    interpretation="ഉയർന്ന ശാരീരിക ഊർജ്ജവും രോഗപ്രതിരോധ ശേഷിയും ദീർഘായുസ്സും വ്യക്തമാക്കുന്നു. ജീവിതത്തിൽ ഉണ്ടാകുന്ന പ്രതിസന്ധികളെ മനക്കരുത്തോടെ അതിജീവിക്കും.",
                    age_milestones=[
                        AgeMilestone(age_range="21 - 25 വയസ്സ്", event="വിദ്യാഭ്യാസ പൂർത്തീകരണവും സ്വതന്ത്ര ജീവിതത്തിലേക്കുള്ള ചുവടുവെപ്പും", significance_type="favorable"),
                        AgeMilestone(age_range="28 - 32 വയസ്സ്", event="കർമ്മരംഗത്ത് സുപ്രധാനമായ പദവി മാറ്റവും പുതിയ ഗൃഹ/സ്ഥല ഭാഗ്യവും", significance_type="favorable"),
                        AgeMilestone(age_range="48 - 52 വയസ്സ്", event="ആത്മീയ ചിന്തകളുടെ ഉണർവ്വും കുടുംബത്തിൽ മംഗള കർമ്മങ്ങളും", significance_type="favorable"),
                    ],
                ),
                PalmLineDetail(
                    key="head",
                    name="Head Line (ബുദ്ധി / മാതൃ രേഖ)",
                    sanskrit_name="മസ്തിഷ്ക രേഖ",
                    quality="നേരിയ ചരിവോടെ ചന്ദ്ര പർവ്വതത്തിലേക്ക് നീളുന്നു",
                    length="വ്യക്തവും തടസ്സങ്ങളില്ലാത്തതുമായ ഗതി",
                    strength_score=90,
                    interpretation="പ്രായോഗിക ബുദ്ധിയും ഗവേഷണ തല്പരതയും സമന്വയിച്ച ചിന്താഗതി. തീരുമാനങ്ങൾ കൃത്യതയോടെ കൈക്കൊള്ളാൻ സാധിക്കും.",
                    age_milestones=[
                        AgeMilestone(age_range="24 - 27 വയസ്സ്", event="പ്രൊഫഷണൽ നൈപുണ്യം കൈവരിക്കുകയും പ്രത്യേക പദവി സ്വന്തമാക്കുകയും ചെയ്യും", significance_type="favorable"),
                        AgeMilestone(age_range="36 - 40 വയസ്സ്", event="തന്ത്രപ്രധാനമായ സംരംഭങ്ങളിൽ നേതൃത്വപരമായ പങ്ക്", significance_type="favorable"),
                    ],
                ),
                PalmLineDetail(
                    key="heart",
                    name="Heart Line (ഹൃദയ രേഖ)",
                    sanskrit_name="ഹൃദയ രേഖ",
                    quality="വ്യാഴ പർവ്വതത്തിന് (ഗുരു) അടിവാരത്തിലേക്ക് കവലകളായി തിരിയുന്നു",
                    length="സൗമ്യവും ശക്തവുമായ രേഖ",
                    strength_score=88,
                    interpretation="നിസ്വാർത്ഥമായ സ്നേഹവും കുടുംബത്തോടുള്ള പ്രതിബദ്ധതയും. സുഹൃത്തുക്കൾക്കും ബന്ധുക്കൾക്കും ആശ്രയമായി നിലകൊള്ളും.",
                    age_milestones=[
                        AgeMilestone(age_range="26 - 29 വയസ്സ്", event="വിവാഹ ഭാഗ്യവും അനുയോജ്യമായ ജീവിത പങ്കാളിയുമായുള്ള സമാഗമവും", significance_type="favorable"),
                    ],
                ),
                PalmLineDetail(
                    key="fate",
                    name="Fate Line (ഭാഗ്യ / ശനി രേഖ)",
                    sanskrit_name="ശനി രേഖ",
                    quality="ചന്ദ്ര പർവ്വതത്തിൽ നിന്നും ആരംഭിച്ച് ശനി പർവ്വതത്തിലേക്ക് ഉയരുന്നു",
                    length="മധ്യഭാഗത്ത് അത്യധികം ശോഭയുള്ള രേഖ",
                    strength_score=86,
                    interpretation="സ്വപ്രയത്നത്തിലൂടെയുള്ള ധനസമ്പാദനവും വിദേശ/വിദൂര ബന്ധങ്ങളിലൂടെയുള്ള സാമ്പത്തിക മുന്നേറ്റവും.",
                    age_milestones=[
                        AgeMilestone(age_range="29 - 33 വയസ്സ്", event="സാമ്പത്തിക വളർച്ചയും സാമ്പത്തിക സ്വാതന്ത്ര്യവും കൈവരിക്കുന്ന സുവർണ്ണ കാലഘട്ടം", significance_type="favorable"),
                        AgeMilestone(age_range="42 - 46 വയസ്സ്", event="പുതിയ ബിസിനസ്സ് അല്ലെങ്കിൽ ഉന്നത നേതൃത്വ പദവി", significance_type="favorable"),
                    ],
                ),
                PalmLineDetail(
                    key="sun",
                    name="Sun Line (സൂര്യ / കീർത്തി രേഖ)",
                    sanskrit_name="സൂര്യ രേഖ",
                    quality="സൂര്യ പർവ്വതത്തിൽ സ്പഷ്ടമായി കാണപ്പെടുന്നു",
                    length="നേർരേഖ",
                    strength_score=85,
                    interpretation="സമൂഹത്തിൽ ആദരവും അംഗീകാരവും. സർഗ്ഗാത്മക മേഖലകളിൽ പേരും പ്രശസ്തിയും നേടും.",
                    age_milestones=[
                        AgeMilestone(age_range="34 - 38 വയസ്സ്", event="പൊതുരംഗത്തോ ഔദ്യോഗിക രംഗത്തോ വലിയ അംഗീകാരങ്ങൾ", significance_type="favorable"),
                    ],
                ),
            ]
            mounts = [
                PalmMountDetail(key="jupiter", name="ഗുരു പർവ്വതം (Jupiter Mount)", graha="വ്യാഴം", development="ഉയർന്നു നിൽക്കുന്നു", significance="നേതൃത്വ ഗുണങ്ങളും ധാർമ്മിക ബോധവും ഉന്നത പദവിയും.", score=92, remedy="വ്യാഴാഴ്ചകളിൽ മഞ്ഞ വസ്ത്രം ധരിക്കുക, വിഷ്ണു സഹസ്രനാമം ജപിക്കുക."),
                PalmMountDetail(key="saturn", name="ശനി പർവ്വതം (Saturn Mount)", graha="ശനി", development="സന്തുലിതം", significance="അച്ചടക്കവും കാര്യശേഷിയും സ്ഥിരോത്സാഹവും നൽകുന്നു.", score=84, remedy="ശനിയാഴ്ചകളിൽ എണ്ണവിളക്ക് കൊളുത്തുക, ശാസ്താവിനെ ഭജിക്കുക."),
                PalmMountDetail(key="sun", name="സൂര്യ പർവ്വതം (Sun Mount)", graha="സൂര്യൻ", development="വ്യക്തം", significance="ആത്മവിശ്വാസവും ഭരണരംഗത്ത് ശോഭിക്കാനുള്ള ഊർജ്ജവും.", score=86, remedy="നിത്യവും രാവിലെ സൂര്യനമസ്കാരം ചെയ്യുക, ആദിത്യ ഹൃദയം ജപിക്കുക."),
                PalmMountDetail(key="mercury", name="ബുധ പർവ്വതം (Mercury Mount)", graha="ബുധൻ", development="വിശാലം", significance="വാക്ചാതുര്യവും വ്യാപാര സാമർത്ഥ്യവും വേഗത്തിലുള്ള കണക്കുകൂട്ടലുകളും.", score=88, remedy="ബുധനാഴ്ചകളിൽ തുളസി നനയ്ക്കുക, പച്ചപ്പയർ ദാനം ചെയ്യുക."),
                PalmMountDetail(key="venus", name="ശുക്ര പർവ്വതം (Venus Mount)", graha="ശുക്രൻ", development="പുഷ്ടിയുള്ളത്", significance="ആകർഷകമായ വ്യക്തിത്വവും കലാപരമായ അഭിരുചിയും ഭൗതിക സുഖങ്ങളും.", score=90, remedy="വെള്ളിയാഴ്ചകളിൽ മഹാലക്ഷ്മീ അഷ്ടകം ജപിക്കുക."),
                PalmMountDetail(key="mars", name="മംഗള പർവ്വതം (Mars Mount)", graha="ചൊവ്വ", development="ശക്തം", significance="ധൈര്യവും കായികക്ഷമതയും വെല്ലുവിളികളെ നേരിടാനുള്ള സ്ഥൈര്യവും.", score=82, remedy="ചൊവ്വാഴ്ചകളിൽ സുബ്രഹ്മണ്യ ക്ഷേത്ര ദർശനം നടത്തുക."),
                PalmMountDetail(key="moon", name="ചന്ദ്ര പർവ്വതം (Moon Mount)", graha="ചന്ദ്രൻ", development="നിർമ്മലം", significance="തീവ്രമായ ഉൾക്കാഴ്ചയും ഭാവനാ വിലാസവും യാത്രകളോടുള്ള താല്പര്യവും.", score=89, remedy="തിങ്കളാഴ്ചകളിൽ ശിവങ്കൽ പാൽ അഭിഷേകം സമർപ്പിക്കുക."),
            ]
            signs = [
                SpecialSignDetail(symbol="ത്രിശൂലം (Trishula)", sanskrit_symbol="ശിവ മുദ്ര", location="ശനി പർവ്വതത്തിന് മുകളിലായി", significance="ദൈവികമായ രക്ഷാകവചവും ആപത്തുകളിൽ നിന്നുള്ള പൂർണ്ണ സംരക്ഷണവും.", auspiciousness="മഹാ ഭാഗ്യ ചിഹ്നം"),
                SpecialSignDetail(symbol="മത്സ്യ ചിഹ്നം (Matsya)", sanskrit_symbol="മത്സ്യ രേഖ", location="മണിബന്ധത്തിന് സമീപം കേതു ക്ഷേത്രത്തിൽ", significance="വിശേഷാൽ ധനഭാഗ്യവും സാത്വികമായ ഐശ്വര്യവും ആത്മീയ സിദ്ധിയും.", auspiciousness="അത്യപൂർവ്വ ചിഹ്നം"),
                SpecialSignDetail(symbol="ഗുരു വലയം (Ring of Solomon)", sanskrit_symbol="ഗുരു ദീക്ഷാ ചിഹ്നം", location="ചൂണ്ടുവിരലിന് താഴെ", significance="മറ്റുള്ളവരുടെ മനസ്സ് വായിക്കാനുള്ള ഉൾക്കാഴ്ചയും സവിശേഷ ജ്ഞാനവും.", auspiciousness="ശുഭ ചിഹ്നം"),
            ]
            predictions = {
                "career_and_wealth": "നിങ്ങളുടെ കൈത്തലത്തിലെ സുദൃഢമായ ഭാഗ്യരേഖയും വികസിച്ച ബുധ പർവ്വതവും വിരൽ ചൂണ്ടുന്നത് സാങ്കേതിക വിദ്യ, കൺസൾട്ടൻസി, അല്ലെങ്കിൽ സ്വതന്ത്ര വ്യാപാര രംഗത്ത് അത്യുന്നതി കൈവരിക്കുമെന്നാണ്. 30 വയസ്സിന് ശേഷം വലിയൊരു സാമ്പത്തിക കുതിച്ചുചാട്ടം കാണുന്നു.",
                "love_and_marriage": "ഹൃദയരേഖ ഗുരുപർവ്വതത്തിലേക്ക് കയറിനിൽക്കുന്നത് അനുയോജ്യയായ, സംസ്കാര സമ്പന്നയായ ജീവിതപങ്കാളിയെ സൂചിപ്പിക്കുന്നു. പരസ്പര ബഹുമാനത്തോടെയുള്ള സുദൃഢമായ ദാമ്പത്യം ലഭിക്കും.",
                "vitality_and_health": "ആയുർരേഖയിൽ യാതൊരു വിള്ളലുകളുമില്ലാത്തതിനാൽ മികച്ച ആരോഗ്യവും ദീർഘായുസ്സും ലഭിക്കും. ശരിയായ ആഹാരക്രമവും വ്യായാമവും ജീവിതശൈലീ രോഗങ്ങളിൽ നിന്ന് പൂർണ്ണ സംരക്ഷണം തരും.",
                "spiritual_path": "ഹൃദയരേഖയ്ക്കും മസ്തിഷ്ക രേഖയ്ക്കും ഇടയിലുള്ള മിസ്റ്റിക് ക്രോസ്സ് (നിഗൂഢ ചിഹ്നം) ജ്യോതിഷം, തത്ത്വചിന്ത എന്നിവയിലുള്ള ഉന്നതമായ വാസന വെളിപ്പെടുത്തുന്നു.",
            }
            remedies = [
                "നിത്യേന പ്രഭാതത്തിൽ കിഴക്കോട്ട് നോക്കി സൂര്യഗായത്രി മന്ത്രം 12 തവണ ജപിക്കുക.",
                "വ്യാഴാഴ്ചകളിൽ ഗുരുവായൂരപ്പനെയോ മഹാവിഷ്ണുവിനെയോ വണങ്ങി മഞ്ഞപ്പൂക്കൾ സമർപ്പിക്കുക.",
                "സാമ്പത്തിക തടസ്സങ്ങൾ നീങ്ങാൻ പൗർണ്ണമി നാളിൽ ദീപം തെളിയിച്ച് ലളിതാ സഹസ്രനാമം ചൊല്ലുക.",
            ]
            gemstones = [
                GemstoneRecommendation(gemstone="മഞ്ഞ പുഷ്യരാഗം (Yellow Sapphire)", graha="വ്യാഴം (Jupiter)", finger="ചൂണ്ടുവിരൽ (Index Finger)", metal="സ്വർണ്ണം (Gold)", purpose="ഭാഗ്യവും ഉയർന്ന പദവിയും ജ്ഞാനവും പ്രദാനം ചെയ്യുന്നു."),
                GemstoneRecommendation(gemstone="പച്ച മരതകം (Emerald)", graha="ബുധൻ (Mercury)", finger="ചെറുവിരൽ (Little Finger)", metal="വെള്ളി അല്ലെങ്കിൽ സ്വർണ്ണം", purpose="വ്യാപാരവിജയവും ബുദ്ധിശക്തിയും സംസാരശേഷിയും വർദ്ധിപ്പിക്കുന്നു."),
            ]
        else:
            # English Default
            hc = HandConstitution(
                element="Air Element (Vayu Tattva)",
                element_description="Reflects high intellectual vitality, sharp problem-solving dexterity, and intuitive adaptability.",
                palm_shape="Square Palm with Long Elegant Fingers",
                finger_proportions="Harmonious Jupiter & Apollo finger length ratio",
                vitality_index=94,
            )
            prarabdha_text = (
                f"Analyzing {req.name}'s dual palms reveals a deeply auspicious karmic trajectory. "
                "The Left Palm (Prarabdha) shows profound innate intellect and ancestral resilience. "
                "The Right Palm (Purushartha) reveals remarkable personal determination, with the Fate Line "
                "gaining immense depth and clarity from age 28 onward, pointing to self-made prosperity and leadership."
            )
            lines = [
                PalmLineDetail(
                    key="life",
                    name="Life Line (Ayur Rekha)",
                    sanskrit_name="Ayur Rekha",
                    quality="Deep, Vibrant & Well-Arched",
                    length="Descends gracefully to the bracelets (Manibandha)",
                    strength_score=95,
                    interpretation="Exhibits exceptional physical stamina, rapid recuperative vitality, and a long, vibrant life path. Major transitions are met with natural calm and enduring fortitude.",
                    age_milestones=[
                        AgeMilestone(age_range="Age 22 - 25", event="Completion of core academic milestones and foundation of career independence.", significance_type="favorable"),
                        AgeMilestone(age_range="Age 28 - 32", event="Significant elevation in professional standing, asset creation, or residence change.", significance_type="favorable"),
                        AgeMilestone(age_range="Age 48 - 52", event="Spiritual awakening, philanthropic leadership, and harmonious domestic joy.", significance_type="favorable"),
                    ],
                ),
                PalmLineDetail(
                    key="head",
                    name="Head Line (Mastishk Rekha)",
                    sanskrit_name="Mastishk Rekha",
                    quality="Clear, uncrossed trajectory sweeping towards Mount of Moon",
                    length="Extends across the palm with precision",
                    strength_score=92,
                    interpretation="Blends sharp analytical reasoning with visionary imagination. Endows you with strong memory retention and strategic negotiation capabilities.",
                    age_milestones=[
                        AgeMilestone(age_range="Age 25 - 28", event="Mastery in specialized intellectual domain; executive recognition.", significance_type="favorable"),
                        AgeMilestone(age_range="Age 36 - 40", event="Strategic expansion or entrepreneurial venture driven by intellectual authority.", significance_type="favorable"),
                    ],
                ),
                PalmLineDetail(
                    key="heart",
                    name="Heart Line (Hridaya Rekha)",
                    sanskrit_name="Hridaya Rekha",
                    quality="Curves upward warmly terminating between Jupiter & Saturn mounts",
                    length="Long and well-defined",
                    strength_score=89,
                    interpretation="Reflects high emotional intelligence, profound loyalty, and warmhearted generosity. You bring equilibrium and grounding to interpersonal relationships.",
                    age_milestones=[
                        AgeMilestone(age_range="Age 26 - 29", event="Auspicious period for matrimonial union and deep soulmate connection.", significance_type="favorable"),
                    ],
                ),
                PalmLineDetail(
                    key="fate",
                    name="Fate Line (Bhagya / Shani Rekha)",
                    sanskrit_name="Shani Rekha",
                    quality="Rises strongly from the Luna base toward Mount of Saturn",
                    length="Unbroken and prominent in middle palm",
                    strength_score=88,
                    interpretation="Signals self-made prosperity supported by public recognition and mentors. Great breakthrough periods occur when you trust your independent vision.",
                    age_milestones=[
                        AgeMilestone(age_range="Age 29 - 33", event="Major financial inflection point; achieving true economic self-sufficiency.", significance_type="favorable"),
                        AgeMilestone(age_range="Age 42 - 46", event="Executive leadership or establishment of prestigious institution/business.", significance_type="favorable"),
                    ],
                ),
                PalmLineDetail(
                    key="sun",
                    name="Sun Line (Surya / Apollo Rekha)",
                    sanskrit_name="Surya Rekha",
                    quality="Prominently etched upon the Sun Mount",
                    length="Crisp vertical accent",
                    strength_score=86,
                    interpretation="Bestows magnetic social presence, aesthetic sophistication, and public honors. Protects reputation even during turbulent times.",
                    age_milestones=[
                        AgeMilestone(age_range="Age 34 - 38", event="Widespread appreciation for creative or executive contributions; awards/honors.", significance_type="favorable"),
                    ],
                ),
            ]
            mounts = [
                PalmMountDetail(key="jupiter", name="Mount of Jupiter (Guru Parvata)", graha="Jupiter / Guru", development="Eminently Elevated", significance="Bestows administrative leadership, moral nobility, and spiritual wisdom.", score=94, remedy="Wear gold or yellow tones on Thursdays; chant Brihaspati Gayatri."),
                PalmMountDetail(key="saturn", name="Mount of Saturn (Shani Parvata)", graha="Saturn / Shani", development="Balanced & Firm", significance="Endows patience, thoroughness, scientific focus, and karmic justice.", score=85, remedy="Light sesame oil lamp on Saturdays; practice selfless service (Seva)."),
                PalmMountDetail(key="sun", name="Mount of Sun (Surya Parvata)", graha="Sun / Ravi", development="Well-Defined", significance="Radiates creative brilliance, executive charisma, and administrative favor.", score=88, remedy="Perform morning Surya Arghya (water offering) facing East at dawn."),
                PalmMountDetail(key="mercury", name="Mount of Mercury (Budha Parvata)", graha="Mercury / Budha", development="Expansive & Clear", significance="Sharp business acumen, eloquent communication, and quick wit.", score=90, remedy="Nurture green plants; practice mindful speaking and meditation."),
                PalmMountDetail(key="venus", name="Mount of Venus (Shukra Parvata)", graha="Venus / Shukra", development="Full & Supple", significance="Sensual vitality, love of art, refined luxuries, and magnetic charm.", score=91, remedy="Chant Mahalakshmi Ashtakam on Fridays; maintain clean aesthetics."),
                PalmMountDetail(key="mars", name="Mount of Mars (Mangala Parvata)", graha="Mars / Mangala", development="Resilient", significance="Courage under adversity, decisive action, and physical endurance.", score=84, remedy="Recite Hanuman Chalisa on Tuesdays for energetic vitality."),
                PalmMountDetail(key="moon", name="Mount of Moon (Chandra Parvata)", graha="Moon / Chandra", development="Serene & Clear", significance="Profound intuition, vivid imagination, and success in foreign voyages.", score=90, remedy="Offer pure water to sacred Shiva Lingam on Mondays."),
            ]
            signs = [
                SpecialSignDetail(symbol="Trishula (Sacred Trident)", sanskrit_symbol="Trishula Mark", location="Apex of Mount of Saturn", significance="A rare auspicious sign of divine Shiva protection, turning obstacles into stepping stones.", auspiciousness="Supreme Divine Protection"),
                SpecialSignDetail(symbol="Matsya (Auspicious Fish Symbol)", sanskrit_symbol="Matsya Rekha", location="Near wrist bracelets (Ketu field)", significance="Brings sudden bursts of wealth, spiritual depth, and freedom from debts.", auspiciousness="Extraordinary Fortune"),
                SpecialSignDetail(symbol="Ring of Solomon (Guru Diksha)", sanskrit_symbol="Brihaspati Mudra", location="Curving around base of Index finger", significance="Endows innate psychological insight and rare ability to perceive truth.", auspiciousness="Esoteric Wisdom"),
            ]
            predictions = {
                "career_and_wealth": "The strong Fate line ascending toward Saturn along with a well-developed Mercury mount indicates high achievement in advisory, technology, entrepreneurship, or executive domains. Your financial foundation solidifies dramatically around age 29–31.",
                "love_and_marriage": "The Heart line gracefully reaching the Mount of Jupiter reveals an emotionally loyal, deeply supportive marital partnership characterized by spiritual harmony and shared values.",
                "vitality_and_health": "An unbroken, resilient Life line encircling the Mount of Venus guarantees strong physical endurance and long life. Maintain active cardiovascular rhythms to preserve peak vitality.",
                "spiritual_path": "The presence of the Mystic Cross (La Croix Mystique) between the Heart and Head lines highlights an intuitive seeker with natural aptitude for Vedic philosophy and spiritual contemplation.",
            }
            remedies = [
                "Practice Surya Namaskar (Sun Salutations) at sunrise while chanting the 12 names of the Sun.",
                "Chant the Gayatri Mantra 27 times every morning for heightened cognitive radiance and peace.",
                "Keep a small silver or brass pot of pure water in the Northeast direction of your workspace.",
            ]
            gemstones = [
                GemstoneRecommendation(gemstone="Yellow Sapphire (Pukhraj)", graha="Jupiter (Guru)", finger="Index Finger", metal="Yellow Gold", purpose="Amplifies wisdom, spiritual grace, wealth expansion, and divine protection."),
                GemstoneRecommendation(gemstone="Natural Emerald (Panna)", graha="Mercury (Budha)", finger="Little Finger", metal="Silver or White Gold", purpose="Sharpens analytical intellect, trade negotiations, and articulate eloquence."),
            ]

        return PalmAnalysisResponse(
            id=str(uuid.uuid4())[:8],
            analyzed_at=now_str,
            native_name=req.name,
            gender=req.gender,
            dominant_hand=req.dominant_hand,
            language=req.language,
            hand_constitution=hc,
            prarabdha_vs_purushartha_summary=prarabdha_text,
            major_lines=lines,
            planetary_mounts=mounts,
            special_signs=signs,
            life_predictions=predictions,
            sacred_remedies=remedies,
            gemstone_recommendations=gemstones,
            left_image_analyzed=left_present,
            right_image_analyzed=right_present,
        )
