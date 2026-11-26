import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image,
  StatusBar, StyleSheet, Modal, Linking,
  ActivityIndicator, TextInput, useWindowDimensions, Platform, Animated, Easing, BackHandler
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import Svg, {Path, Circle, Rect, Polygon} from 'react-native-svg';

const C = {
  bg:'#070A16', panel:'#10172A', panel2:'#19213A',
  white:'#F4F8FF', muted:'#98A8C6', violet:'#A78BFA',
  cyan:'#72E8FF', pink:'#D7A7FF', gold:'#E9D39F',
  line:'rgba(133,190,255,.24)', green:'#65D6B0'
};

const TIKTOK = 'https://www.tiktok.com/@erroreditx99';

const SOCIAL = [
  {name:'TikTok',icon:'♪',color:'#80E8F3',url:TIKTOK},
  {name:'Instagram',icon:'◎',color:'#E9A1E9',url:'https://www.instagram.com/erroreditx99'},
  {name:'YouTube',icon:'▶',color:'#FF777D',url:'https://m.youtube.com/@erroreditx-o2t'},
  {name:'Facebook',icon:'f',color:'#65A8FF',url:'https://www.facebook.com/share/1CF15iyNv6/'}
];

const TOOL_GROUPS = {
  Edit: ['Selection','Hand','Import','Media Library','Media Search','Trim','Cut','Split','Slice','Crop','Resize','Rotate','Flip','Mirror','Reverse','Freeze Frame','Loop','Duplicate','Merge','Join','Razor Tool','Ripple Edit','Roll Edit','Slip','Slide','Delete','Speed','Speed Ramp','Time Remap','Frame Hold','Track Select Forward','Track Select Backward','Rate Stretch','Ripple Delete','Lift','Extract','Add Edit','Extend Edit','Replace Clip','Synchronize Clips','Link Clips','Unlink Clips','Nest Sequence','Proxy Workflow','Multi-Camera Editing','Scene Edit Detection','Auto Reframe','Adjustment Layer','Essential Sound','Essential Graphics','Lumetri Color','Audio Gain','Audio Mixer','Markers','Source Monitor','Program Monitor'],
  Motion: ['Keyframe','Graph Editor','Curve Editor','Velocity Curve','Ease In','Ease Out','Motion Blur','Motion Paths','Parenting','Anchor Point','Null Object','Expressions','Camera Tracking','3D Tracking','Position','Scale','Rotation','Opacity','Puppet Pin','Shape Layers','Shape Morphing','Mask Path Animation','Track Matte','Time Remapping','3D Camera','3D Lights','3D Layers','Pre-compose','Motion Tile','Repeater','Trim Paths','Wiggle','Loop Expression','Bezier Handles','Speed Graph','Value Graph','Roto Brush','Content-Aware Fill Video','Stabilize Motion'],
  Color: ['Adjustment','Filters','Color Correction','Color Grading','LUTs','HSL','Curves','Brightness','Contrast','Saturation','Exposure','Temperature','Tint','Shadows','Highlights','HDR','SDR','LOG to Rec.709','Sharpen','Blur','Denoise','Color Wheels','Vectorscope','Waveform Monitor','RGB Parade'],
  Audio: ['MP3 Cutter','MP4 Audio Extractor','Fade In','Fade Out','Equalizer','Reverb','Echo','Compressor','Limiter','Pitch Changer','Tempo Changer','Auto Tune','Noise Gate','Voice Changer','Voice Generator','Text to Speech','Speech to Text','Voice Cloning','AI Cover','AI Music Generator','Vocal Remover','Audacity AI Tools','CapCut Voice Changer','Noise Reduction','Auto Beat Sync','Bass Boost','Audio Ducking','Multitrack Audio'],
  Effects: ['Filters','Video Effects','Glitch','VHS','Old Film','Lens Flare','Light Leak','Bokeh','Chromatic Aberration','Distortion','Warp','Shake','Earthquake','3D','Particles','Smoke','Fire','Rain','Snow','Sky Replacement','Glow','Film Grain','Lens Blur'],
  Transitions: ['Zoom In','Zoom Out','Whip','Spin','Warp Transition','Glitch Transition','Morph','Cross Dissolve','Swipe','Camera L','Match Cut','Light Flash'],
  Text: ['Title Tool','Kinetic Typography','Auto Captions','Subtitle Generator','Logo Animation','Lower Third','Motion Graphics','Shape Tool','Vector Drawing','Pen Tool','3D Text','Text Tracking'],
  Advanced: ['Masking','Rotoscoping','Chroma Key','Green Screen','Motion Tracking','Face Tracking','Body Tracking','Camera Tracking','3D Tracking','Stabilization','Hyperlapse','Proxy Editing','Multi-Camera','Nested Sequences','Scene Detection','Beat Markers'],
  AI: ['AI Video Enhancer','AI Quality Upscaler','FPS Booster','RIFE AI','Flowframes','DAIN','CAIN','FLAVR','Real-ESRGAN','Waifu2x','ESRGAN','Remini AI','HitPaw Video Enhancer','Wink AI','AI Object Removal','AI Background Removal','AI Auto Reframe','AI Scene Generator','Image to Video','Video to Video','AI Denoiser','AI Stabilizer','AI Captions','AI Voice','AI Photo Enhancer'],
  Photo: ['Photo Crop','Photo Resize','Photo Rotate','Layers','Blend Modes','Healing Brush','Clone Stamp','Liquify','Perspective Correction','RAW Editing','Background Removal','Background Replacement','Photo Filters','Photo Color Grade','Photo Curves','Photo HSL','Photo Sharpen','Photo Denoise','Photo Upscale','Object Removal','Portrait Retouch','3D Photo','Move Tool','Marquee Selection','Lasso Tool','Quick Selection','Magic Wand','Brush Tool','Pencil Tool','Eraser Tool','Gradient Tool','Paint Bucket','Eyedropper','Spot Healing Brush','Patch Tool','Content-Aware Fill','Dodge Tool','Burn Tool','Sponge Tool','Smudge Tool','Blur Tool','Sharpen Tool','Shape Layers','Smart Objects','Layer Masks','Adjustment Layers','Clipping Masks','Typography','Perspective Warp','Vanishing Point','Camera RAW','Lens Correction','Selective Color','Photo Compositing','Frequency Separation'],
  Output: ['Export','Export Presets','Bitrate','Codec','Color Space','Chroma Subsampling','Audio Sample Rate','Project Backup','Cloud Storage','Account Sync']
};
const TOOL_ICONS = {
  'Import':'⇧','Media Library':'▤','Media Search':'⌕','Selection':'↖','Hand':'✋',
  'Trim':'⟷','Cut':'⌁','Split':'✂','Slice':'◩','Crop':'⌗','Resize':'⤢','Rotate':'⟳','Flip':'⇋','Mirror':'◫',
  'Reverse':'◀','Freeze Frame':'❄','Loop':'⟳','Duplicate':'▣','Merge':'⊕','Join':'⊔','Razor Tool':'╱',
  'Speed':'◷','Speed Ramp':'⌁','Time Remap':'◴','Frame Hold':'Ⅱ','Keyframe':'◇','Graph Editor':'⌁',
  'Curve Editor':'∿','Velocity Curve':'⌁','Motion Blur':'≋','Motion Paths':'⌖','Anchor Point':'⊙',
  'Color Correction':'◐','Color Grading':'◒','LUTs':'▦','HSL':'◉','Curves':'∿','Brightness':'☼',
  'Contrast':'◑','Saturation':'◍','Exposure':'☀','Temperature':'♨','Tint':'◈','Shadows':'◒',
  'Highlights':'✧','HDR':'◉','Sharpen':'✣','Blur':'◌','Denoise':'▧','Color Wheels':'◉',
  'MP3 Cutter':'♫','MP4 Audio Extractor':'♬','Equalizer':'▥','Reverb':'〰','Echo':'∿',
  'Compressor':'▤','Pitch Changer':'♩','Noise Reduction':'▥','Auto Beat Sync':'♬',
  'Glitch':'▨','VHS':'▥','Lens Flare':'☼','Light Leak':'◉','Bokeh':'❖','Distortion':'⌁',
  'Shake':'↝','3D':'◇','Particles':'⁙','Smoke':'≋','Fire':'♨','Rain':'╱','Snow':'❄','Glow':'✧',
  'Zoom In':'⊕','Zoom Out':'⊖','Whip':'➜','Spin':'⟳','Morph':'◉','Cross Dissolve':'◍',
  'Title Tool':'T','Auto Captions':'▤','Subtitle Generator':'▤','Logo Animation':'◇',
  'Shape Tool':'⬡','Vector Drawing':'⌁','Pen Tool':'✎','3D Text':'T³','Masking':'◩',
  'Rotoscoping':'✂','Chroma Key':'▧','Green Screen':'▣','Motion Tracking':'⌖',
  'Stabilization':'⊕','FPS Booster':'⏩','RIFE AI':'R','Flowframes':'F','DAIN':'D',
  'AI Video Enhancer':'✧','AI Quality Upscaler':'⤢','AI Photo Enhancer':'▧',
  'Photo Crop':'⌗','Photo Resize':'⤢','Photo Rotate':'⟳','Layers':'▤',
  'Export':'⇧','Export Presets':'▦','Bitrate':'▥','Codec':'▧'
};
const UNIQUE_TOOL_GLYPHS = ['⌖','✂','⤢','⟳','⇋','◩','❄','▣','⊕','⊔','╱','◷','∿','≋','⊙','◐','◒','▦','◉','☼','◑','☀','♨','◈','✧','◌','▧','♫','♬','▥','〰','∿','▤','♩','▨','❖','↝','⁙','➜','⊖','✎','⬡','T³','◍','◒','⌗','✦','⏩','R','F','D','◫','⌁','◉','♧','◉','◌','▤','◈','⌘','⌑','⌗','◭','◮','◬','⬡','◇','◈','✣','✥','✺','✹','✸','✷','✶','✵','✴','✳','✲','✱','✧','✦','✪','✫','✬','✭','✮','✯','✰','⟲','⟳','⤴','⤵','⇄','⇆','⇅','⇵','⤢','⤡','⤧','⤨','⤩','⤪','⤫','⤬','⌁','⌇','⌖','⌗','⌘','⌥','⌦','⌫','⏱','⏲','⏵','⏸','⏹','⏺','◉','◎','◌','◍','◐','◑','◒','◓','◔','◕','◖','◗','◘','◙','◚','◛','◜','◝','◞','◟','◠','◡','◢','◣','◤','◥','◦','◧','◨','◩','◪','◫','◬','◭','◮','◯','⬟','⬢','⬣','⬡','⬠','⬤','⬥','⬦','⬧','⬨','⬩','⬪','⬫','⬬','⬭','⬮','⬯'];
let glyphIndex=0;
Object.values(TOOL_GROUPS).flat().forEach(name=>{if(!TOOL_ICONS[name])TOOL_ICONS[name]=UNIQUE_TOOL_GLYPHS[glyphIndex++%UNIQUE_TOOL_GLYPHS.length];});
const groupGlyphs = {Edit:'⌁',Motion:'◇',Color:'◉',Audio:'♫',Effects:'✣',Transitions:'⇢',Text:'T',Advanced:'⌖',AI:'✧',Photo:'▧',Output:'⇧'};
const TOOLS = Object.entries(TOOL_GROUPS).flatMap(([group,names])=>names.map(name=>[name,TOOL_ICONS[name]||groupGlyphs[group]||'⌁',group]));
const RESOLUTIONS = ['144p','240p','360p','480p','720p HD','1080p Full HD','2K QHD','4K Ultra HD','5K','6K','8K Ultra HD','12K','16K Ultra HD'];
const FORMATS = ['MP3','MP4','MOV','AVI','MKV','WEBM','ProRes','DNxHD'];
const FRAME_RATES = ['24 FPS','30 FPS','60 FPS','90 FPS','120 FPS','240 FPS','480 FPS','960 FPS','1000 FPS','2000 FPS','10000 FPS (Future)'];
const AI_MODELS = ['Topaz Video AI','Topaz Photo AI','RIFE AI','Flowframes','DAIN','CAIN','FLAVR','Real-ESRGAN','Waifu2x','ESRGAN','Remini AI','HitPaw Video Enhancer','Wink AI','CapCut AI Enhancer','Adobe Firefly Video','Runway Gen-3 / Gen-4','Luma Dream Machine','Sora','Pika Labs','Stable Video Diffusion','Kling AI','ElevenLabs','Descript Overdub','Respeecher','Murf AI','Play.ht','LOVO AI','Replica Studios','Adobe Podcast Enhance','Voicemod'];
const CREATOR_LEVELS = [
  {level:1,name:'Bronze I',points:20,stars:3,frame:'Bronze I Frame',reward:'15 days'},
  {level:2,name:'Bronze II',points:25,stars:4,frame:'Bronze II Frame',reward:'30 days'},
  {level:3,name:'Silver I',points:100,stars:6,frame:'Silver I Crystal Frame',reward:'2 months'},
  {level:4,name:'Silver II',points:500,stars:8,frame:'Silver II Elite Frame',reward:'6 months'},
  {level:5,name:'Gold I',points:2500,stars:12,frame:'Gold I Royal Frame',reward:'1 year'},
  {level:6,name:'Gold II',points:30000,stars:14,frame:'Gold II Royal Frame',reward:'18 months'},
  {level:7,name:'Platinum',points:60000,stars:18,frame:'Platinum Crystal Frame',reward:'All Premium Features'},
  {level:8,name:'Legendary',points:100000,stars:30,frame:'Legendary Signature Frame',reward:'All Premium + Legendary Benefits'}
];
const QUICK_TOOLS = ['AI Video Enhancer','AI Quality Upscaler','FPS Booster','AI Photo Enhancer','AI Denoiser','AI Stabilizer','Background Removal','Color Grading','Auto Captions','Vocal Remover','Object Removal'];


const OPTIONS = {
  'Filters':['Cinematic','Vintage','Portrait','Warm','Cool','Black & White','Fade','Film','Retro','Neon','Intensity','Apply filter'],
  'Adjustment':['Brightness','Contrast','Exposure','Saturation','Temperature','Tint','Highlights','Shadows','Whites','Blacks','Vibrance','Reset adjustments'],
  'HSL':['Hue','Saturation','Luminance','Red channel','Orange channel','Yellow channel','Green channel','Cyan channel','Blue channel','Purple channel','Magenta channel','Reset HSL'],
  'Chroma Key':['Select key color','Green screen preset','Blue screen preset','Key intensity','Spill suppression','Edge feather','Shadow cleanup','Preview key'],
  'Masking':['Rectangle mask','Ellipse mask','Linear mask','Custom pen mask','Feather','Expansion','Invert mask','Track mask'],
  'Color Correction':['Auto correction','White balance','Exposure','Contrast','Highlights','Shadows','Whites','Blacks','Temperature','Tint','Saturation','Vibrance'],
  'Color Grading':['Basic correction','Color wheels','HSL','Curves','LUT library','LOG to Rec.709','Split toning','Film look'],
  'Filters':['Cinematic','Vintage','Portrait','Warm','Cool','Black & White','Fade','Film','Retro','Neon','Apply filter intensity'],
  'Effects':['Video effects','Lens effects','Light effects','Glitch effects','Blur effects','Distortion effects','Particles','Film grain','Glow','Preview effect'],
  'Transitions':['Dissolve','Fade','Zoom','Whip','Spin','Glitch','Mask reveal','Light leak','Duration 0.5s','Duration 1.0s'],
  Import:['Choose video','Choose audio','Choose image','Import folder','Search imported media'],
  Split:['Split at playhead','Split all tracks','Split selected track'],
  Trim:['Trim start','Trim end','Trim both sides'],
  Speed:['0.1×','0.2×','0.25×','0.3×','0.5×','0.75×','1×','1.25×','1.5×','2×','3×','4×','5×','8×','10×','20×','25×','50×','75×','100×','Speed Ramp','Custom Speed Curve','Reverse Speed','Freeze Frame','Frame Interpolation','Frame Blending','Optical Flow','RIFE AI','DAIN AI','CAIN AI','FLAVR AI','30 FPS','60 FPS','90 FPS','120 FPS','240 FPS'],
  'Frame Interpolation':['Off','Frame Blending','Optical Flow','AI Frame Generation','30 → 60 FPS','30 → 120 FPS','60 → 120 FPS','120 → 240 FPS','RIFE AI · 120 FPS','RIFE AI · 240 FPS','DAIN AI · 120 FPS','DAIN AI · 240 FPS'],
  'AI Video Enhancer':['Topaz Video AI · Proteus','Topaz Video AI · Iris','Topaz Video AI · Artemis','Enhance fine details','Recover texture','Denoise video','Deblur motion','Improve clarity','AI processing service required'],
  'AI Quality Upscaler':['2× AI Upscale','4× AI Upscale','8K Ultra HD Upscale','Topaz-style detail recovery','Face refinement','Texture recovery','AI processing service required'],
  'FPS Booster':['30 → 60 FPS','30 → 120 FPS','60 → 120 FPS','120 → 240 FPS','Optical Flow','RIFE AI Interpolation','DAIN AI Interpolation','AI frame generation required'],
  'Color Grading':['Basic correction','Color wheels','HSL','Curves','LUT library','LOG to Rec.709'],
  Export:[...RESOLUTIONS,...FRAME_RATES,...FORMATS]
};


const PREVIEWS = [
  {name:'AI ENHANCE',sub:'Improve video clarity',icon:'✦',color:'#9C79F5',tool:'AI Enhance'},
  {name:'FPS CONTROL',sub:'24 to 240 FPS options',icon:'◷',color:'#54C9D7',tool:'Export'},
  {name:'SMART CUTTER',sub:'Split and trim clips',icon:'✂',color:'#E2A2E8',tool:'Split'},
  {name:'COLOR STUDIO',sub:'Professional color tools',icon:'◐',color:'#D9B56C',tool:'Color Grade'},
  {name:'MOTION DESIGN',sub:'Keyframes and graphs',icon:'◇',color:'#6EA7E8',tool:'Keyframe'},
  {name:'AUDIO STUDIO',sub:'Music and sound control',icon:'♫',color:'#65C8A9',tool:'Audio'}
];

const SHORTCUTS = {
  'v':'Selection','h':'Hand','i':'Import','b':'Split',
  't':'Text','c':'Crop','r':'Rotate','s':'Speed',
  'a':'Audio','m':'Mask','e':'Effects','f':'Filters',
  'k':'Keyframe','g':'Graph Editor','l':'Lighting',
  'p':'Photo Enhance','n':'Noise Removal','x':'Chroma Key',
  'o':'Object Remove','u':'AI Upscale','j':'Tracking',
  'w':'Reverse','q':'Freeze Frame'
};

function EPLogo({size=54}) {
  return (
    <View style={{width:size,height:size,alignItems:'center',justifyContent:'center'}}>
      <View style={{position:'absolute',width:size*.78,height:size*.78,transform:[{rotate:'45deg'}],borderWidth:2,borderColor:'#47E9FF',borderTopColor:'#C17BFF',borderRightColor:'#8D5BFF',backgroundColor:'rgba(9,18,48,.96)',shadowColor:'#7D45FF',shadowOpacity:.95,shadowRadius:size*.28,elevation:12}}/>
      <View style={{position:'absolute',width:size*.62,height:size*.62,transform:[{rotate:'45deg'}],borderWidth:1,borderColor:'rgba(193,137,255,.85)',backgroundColor:'rgba(44,31,111,.30)'}}/>
      <Text style={{position:'absolute',top:size*.02,color:'#EAD8FF',fontSize:size*.22,fontWeight:'900',textShadowColor:'#A34FFF',textShadowRadius:7}}>♛</Text>
      <Text style={{color:'#63EFFF',fontSize:size*.36,fontWeight:'900',fontStyle:'italic',textShadowColor:'#7C43FF',textShadowRadius:10,marginTop:size*.12}}>EP</Text>
      <View style={{position:'absolute',top:size*.13,right:size*.12,width:size*.16,height:2,backgroundColor:'#FFFFFF',transform:[{rotate:'-38deg'}]}}/>
    </View>
  );
}


function CrystalGlassButton({glyph,label,onPress,active=false,accent='#7CEBFF',small=false}) {
  return (
    <TouchableOpacity activeOpacity={.78} onPress={onPress}
      style={{flex:1,minWidth:0,height:small?45:56,alignItems:'center',justifyContent:'center',
        borderRadius:small?13:17,overflow:'hidden',
        backgroundColor:active?'rgba(64,204,255,.24)':'rgba(20,29,65,.76)',
        borderWidth:1.4,borderTopColor:'rgba(255,255,255,.98)',
        borderLeftColor:'rgba(203,223,255,.72)',borderRightColor:accent,
        borderBottomColor:'rgba(95,112,170,.92)',
        shadowColor:accent,shadowOpacity:active?.85:.52,shadowRadius:active?20:13,elevation:active?14:9}}>
      <View pointerEvents="none" style={{position:'absolute',left:2,right:2,top:2,height:'42%',borderTopLeftRadius:13,borderTopRightRadius:13,backgroundColor:'rgba(255,255,255,.20)',borderBottomWidth:1,borderBottomColor:'rgba(255,255,255,.15)'}}/>
      <View pointerEvents="none" style={{position:'absolute',left:-18,right:-18,bottom:-24,height:42,backgroundColor:'rgba(98,70,255,.22)',transform:[{rotate:'-12deg'}],borderTopWidth:1,borderColor:'rgba(127,230,255,.42)'}}/>
      <View pointerEvents="none" style={{position:'absolute',left:0,top:0,bottom:0,width:2,backgroundColor:'rgba(255,255,255,.65)'}}/>
      <Text style={{color:accent,fontSize:small?18:22,fontWeight:'900',textShadowColor:accent,textShadowRadius:14}}>{glyph}</Text>
      <Text numberOfLines={1} adjustsFontSizeToFit style={{color:'#FFFFFF',fontSize:small?7:8,fontWeight:'900',letterSpacing:.8,marginTop:3,textShadowColor:accent,textShadowRadius:5}}>{label}</Text>
    </TouchableOpacity>
  );
}

function FogBrandPreview({desktop=false}) {
  const driftA=useRef(new Animated.Value(0)).current;
  const driftB=useRef(new Animated.Value(0)).current;
  const pulse=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    const a=Animated.loop(Animated.sequence([
      Animated.timing(driftA,{toValue:1,duration:8500,useNativeDriver:true}),
      Animated.timing(driftA,{toValue:0,duration:8500,useNativeDriver:true})
    ]));
    const b=Animated.loop(Animated.sequence([
      Animated.timing(driftB,{toValue:1,duration:11000,useNativeDriver:true}),
      Animated.timing(driftB,{toValue:0,duration:11000,useNativeDriver:true})
    ]));
    const p=Animated.loop(Animated.sequence([
      Animated.timing(pulse,{toValue:1,duration:2400,useNativeDriver:true}),
      Animated.timing(pulse,{toValue:0,duration:2400,useNativeDriver:true})
    ]));
    a.start();b.start();p.start();
    return ()=>{a.stop();b.stop();p.stop();};
  },[driftA,driftB,pulse]);
  const moveA=driftA.interpolate({inputRange:[0,1],outputRange:[-42,42]});
  const moveB=driftB.interpolate({inputRange:[0,1],outputRange:[38,-38]});
  const glow=pulse.interpolate({inputRange:[0,1],outputRange:[.35,.95]});
  const scale=pulse.interpolate({inputRange:[0,1],outputRange:[.94,1.05]});
  return (
    <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,overflow:'hidden',alignItems:'center',justifyContent:'center',backgroundColor:'#050817'}}>
      <View pointerEvents="none" style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'#07122D'}}/>
      <Animated.View pointerEvents="none" style={{position:'absolute',width:'85%',height:'150%',left:'-25%',top:'-25%',borderRadius:999,backgroundColor:'rgba(0,213,255,.16)',transform:[{translateX:moveA},{rotate:'-24deg'}],opacity:.9}}/>
      <Animated.View pointerEvents="none" style={{position:'absolute',width:'78%',height:'160%',right:'-25%',top:'-25%',borderRadius:999,backgroundColor:'rgba(151,53,255,.22)',transform:[{translateX:moveB},{rotate:'24deg'}],opacity:.85}}/>
      <Animated.View pointerEvents="none" style={{position:'absolute',width:'110%',height:'70%',bottom:'-45%',borderRadius:999,backgroundColor:'rgba(31,96,255,.18)',transform:[{translateX:moveA}],opacity:.8}}/>
      <View pointerEvents="none" style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(3,5,18,.22)',borderWidth:1,borderColor:'rgba(115,224,255,.25)'}}/>
      <Animated.View style={{alignItems:'center',justifyContent:'center',transform:[{scale}],opacity:glow}}>
        <View style={{width:desktop?104:126,height:desktop?104:126,alignItems:'center',justifyContent:'center',borderRadius:30,borderWidth:1.5,borderColor:'#75EFFF',backgroundColor:'rgba(11,17,48,.55)',shadowColor:'#28DFFF',shadowOpacity:1,shadowRadius:32,elevation:22}}>
          <View style={{position:'absolute',width:'82%',height:'82%',borderWidth:1,borderColor:'#B66DFF',borderRadius:23,transform:[{rotate:'45deg'}],shadowColor:'#9E46FF',shadowOpacity:1,shadowRadius:25}}/>
          <EPLogo size={desktop?84:104}/>
        </View>
        <Text style={{color:'#FFFFFF',fontSize:desktop?19:23,fontWeight:'900',fontStyle:'italic',letterSpacing:2,marginTop:10,textShadowColor:'#9C4EFF',textShadowRadius:18}}>ERROR <Text style={{color:'#53E8FF'}}>PIXEL</Text></Text>
        <Text style={{color:'#D9D7FF',fontSize:desktop?7:9,fontWeight:'800',letterSpacing:3,marginTop:4}}>EDIT · CREATE · INSPIRE</Text>
        <View style={{marginTop:9,paddingHorizontal:13,paddingVertical:5,borderRadius:20,backgroundColor:'rgba(7,13,37,.65)',borderWidth:1,borderColor:'rgba(105,226,255,.48)'}}>
          <Text style={{color:'#AEEFFF',fontSize:desktop?6:8,fontWeight:'800',letterSpacing:1.3}}>YOUR CREATIVE PREVIEW</Text>
        </View>
      </Animated.View>
      <Animated.View pointerEvents="none" style={{position:'absolute',left:'8%',right:'8%',height:1,bottom:'16%',backgroundColor:'#70E9FF',opacity:glow,shadowColor:'#4BE8FF',shadowRadius:12,shadowOpacity:1}}/>
    </View>
  );
}

function RoundButton({children,onPress,active=false,style}) {
  return (
    <TouchableOpacity activeOpacity={.78} onPress={onPress}
      style={[s.roundButton,active&&s.roundActive,style]}>
      {children}
    </TouchableOpacity>
  );
}

function BrandSocialIcon({name,size=23}) {
  if(name==='TikTok') return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M15.2 2h3.1c.2 2.1 1.4 3.8 3.7 4.4v3.2a9.2 9.2 0 0 1-3.7-1.1v7.1a6.4 6.4 0 1 1-6.4-6.4c.4 0 .8 0 1.2.1v3.4a3.1 3.1 0 1 0 2.1 3V2Z" fill="#25F4EE" transform="translate(-1 0)"/><Path d="M16.6 2h2.1c.2 2.1 1.2 3.7 3.3 4.4v2.8a8.1 8.1 0 0 1-3.3-1v7.2a6.4 6.4 0 1 1-6.4-6.4c.4 0 .8 0 1.2.1v3.4a3.1 3.1 0 1 0 2.1 3V2Z" fill="#FE2C55" transform="translate(-1 1)"/><Path d="M15.8 2h2.3c.2 2.1 1.3 3.8 3.4 4.4v2.9a8.4 8.4 0 0 1-3.4-1v7.1a6.4 6.4 0 1 1-6.4-6.4c.4 0 .8 0 1.2.1v3.4a3.1 3.1 0 1 0 2.1 3V2Z" fill="#FFFFFF"/></Svg>;
  if(name==='Instagram') return <Svg width={size} height={size} viewBox="0 0 24 24"><Rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="#F5B3D5" strokeWidth="2.1"/><Circle cx="12" cy="12" r="4.2" fill="none" stroke="#FFFFFF" strokeWidth="2"/><Circle cx="17.6" cy="6.7" r="1.25" fill="#F5B3D5"/></Svg>;
  if(name==='YouTube') return <Svg width={size} height={size} viewBox="0 0 24 24"><Rect x="2" y="5" width="20" height="14" rx="4.2" fill="#FF2638"/><Path d="M10 8.6 16 12l-6 3.4V8.6Z" fill="#FFFFFF"/></Svg>;
  return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M14.2 21v-8h2.7l.4-3.2h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.2H8V13h2.8v8h3.4Z" fill="#FFFFFF"/><Circle cx="12" cy="12" r="11" fill="#1877F2" opacity=".25"/></Svg>;
}
function SocialDock({onOpen,wide=false}) {
  return (
    <View style={{flexDirection:wide?'column':'row',alignItems:'center',justifyContent:'center',gap:wide?13:10,marginTop:17,paddingVertical:wide?10:12,paddingHorizontal:wide?7:12,borderRadius:22,backgroundColor:'rgba(9,13,34,.88)',borderWidth:1,borderColor:'rgba(153,111,255,.62)',shadowColor:'#9D54FF',shadowOpacity:.36,shadowRadius:18,elevation:12}}>
      {SOCIAL.map(x=>(
        <TouchableOpacity key={x.name} accessibilityLabel={'Open '+x.name} onPress={()=>onOpen(x.url)} style={{width:wide?46:54,height:wide?46:48,borderRadius:15,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(26,31,65,.92)',borderWidth:1,borderColor:'rgba(111,220,255,.45)',shadowColor:x.color,shadowOpacity:.35,shadowRadius:9,elevation:5}}>
          <BrandSocialIcon name={x.name} size={24}/>
          {!wide&&<Text style={{color:'#DCE7FF',fontSize:7,fontWeight:'800',marginTop:3}}>{x.name}</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function PreviewCard({item,onPress}) {
  return (
    <TouchableOpacity style={s.previewCard} onPress={onPress}>
      <View style={[s.previewVisual,{borderColor:item.color+'66'}]}>
        <Text style={[s.previewIcon,{color:item.color}]}>{item.icon}</Text>
        <Text style={s.previewPlay}>FEATURE PREVIEW</Text>
      </View>
      <Text style={s.previewName}>{item.name}</Text>
      <Text style={s.previewSub}>{item.sub}</Text>
    </TouchableOpacity>
  );
}

function getToolButtonShape(item) {
  const group=item[2],name=item[0];
  let hash=0;for(let i=0;i<name.length;i++)hash=(hash*31+name.charCodeAt(i))>>>0;
  const variants=[
    {width:36,height:36,borderRadius:18},
    {width:42,height:32,borderRadius:7,transform:[{skewX:'-10deg'}]},
    {width:34,height:40,borderRadius:9,borderTopLeftRadius:18},
    {width:38,height:34,borderRadius:5,transform:[{rotate:'-8deg'}]},
    {width:36,height:36,borderRadius:4,borderWidth:2},
    {width:40,height:34,borderRadius:12,borderBottomRightRadius:3},
    {width:34,height:38,borderRadius:8,transform:[{rotate:'8deg'}]},
    {width:42,height:34,borderRadius:17,borderTopRightRadius:4}
  ];
  const tint=group==='Audio'?'rgba(101,214,176,.48)':group==='Text'?'rgba(215,167,255,.55)':group==='Effects'||group==='Transitions'?'rgba(255,157,210,.55)':group==='Color'?'rgba(255,194,112,.58)':group==='Motion'?'rgba(110,167,232,.62)':group==='AI'?'rgba(167,139,250,.62)':group==='Output'?'rgba(233,211,159,.62)':group==='Photo'?'rgba(128,190,255,.58)':group==='Advanced'?'rgba(114,232,255,.52)':'rgba(180,190,220,.42)';
  return {...variants[hash%variants.length],borderWidth:1.5,borderColor:tint,backgroundColor:'rgba(255,255,255,.055)'};
}
function ToolButton({item,active,onPress,compact=false}) {
  const shape=getToolButtonShape(item);
  const tint= item[2]==='Audio'?'#65D6B0':item[2]==='Text'?'#D7A7FF':item[2]==='Effects'||item[2]==='Transitions'?'#FF9DD2':item[2]==='Color'?'#FFC270':item[2]==='Motion'?'#6EA7E8':item[2]==='AI'?'#A78BFA':item[2]==='Output'?'#E9D39F':item[2]==='Photo'?'#80BEFF':item[2]==='Advanced'?'#72E8FF':'#D5D1EB';
  return (
    <TouchableOpacity style={compact?s.desktopTool:s.toolItem} onPress={onPress}>
      <View style={[s.toolCircle,shape,active&&s.toolCircleActive,compact&&s.desktopToolCircle]}>
        <Text style={[s.toolGlyph,{color:tint},active&&{color:C.cyan}]}>{item[1]}</Text>
      </View>
      <Text style={[s.toolName,active&&{color:C.white},compact&&s.desktopToolName]}>
        {item[0]}
      </Text>
    </TouchableOpacity>
  );
}

function TurboEngine(){
  const [started,setStarted]=useState(false);
  const pulse=useRef(new Animated.Value(.35)).current;
  useEffect(()=>{
    const loop=Animated.loop(Animated.sequence([
      Animated.timing(pulse,{toValue:1,duration:850,easing:Easing.inOut(Easing.ease),useNativeDriver:true}),
      Animated.timing(pulse,{toValue:.35,duration:850,easing:Easing.inOut(Easing.ease),useNativeDriver:true})
    ]));
    loop.start();
    return ()=>loop.stop();
  },[pulse]);
  return <View style={s.turboPanel}>
    <View style={s.turboTop}><Animated.View style={[s.turboLamp,{opacity:pulse}]}/><Text style={s.turboTitle}>TURBO ENGINE</Text><TouchableOpacity onPress={()=>setStarted(v=>!v)}><Text style={s.turboLive}>{started?'ENGINE UI ACTIVE':'▶ START TURBO'}</Text></TouchableOpacity></View>
    <Text style={s.turboSub}>{started?'WORKSPACE SESSION ACTIVE · RENDER ENGINE CONNECTION STILL REQUIRED':'COMPOSITION · LAYERS · KEYFRAMES · GRAPH EDITOR · EFFECTS RACK'}</Text>
  </View>;
}

function AppContent() {
  const {width,height}=useWindowDimensions();
  const landscape=width>height;
  const wide=width>=1100;

  const [page,setPage]=useState('welcome');
  const [drawer,setDrawer]=useState(false);
  const [tool,setTool]=useState('Split');
  const [lastAction,setLastAction]=useState('Ready to edit');
  const [clips,setClips]=useState(1);
  const [playing,setPlaying]=useState(false);
  const [fps,setFps]=useState('60 FPS');
  const [speed,setSpeed]=useState(1);
  const [selectedProjectId,setSelectedProjectId]=useState(null);
  const [storageReady,setStorageReady]=useState(false);
  const [playhead,setPlayhead]=useState(50);
  const [keyframes,setKeyframes]=useState([]);
  const [resolution,setResolution]=useState('1080p');
  const [modal,setModal]=useState('');
  const [helpQuestion,setHelpQuestion]=useState('');
  const [projectName,setProjectName]=useState('Untitled Project');
  const [trackCount,setTrackCount]=useState(12);
  const [category,setCategory]=useState('Edit');
  const [projects,setProjects]=useState([]);
  const [keyframeActive,setKeyframeActive]=useState(false);
  const [shortcutPanel,setShortcutPanel]=useState(false);
  const [toolSearch,setToolSearch]=useState('');
  const [mediaSearch,setMediaSearch]=useState('');
  const [projectType,setProjectType]=useState('video');
  const [photoProjects,setPhotoProjects]=useState([]);
  const [creatorId,setCreatorId]=useState('EP-OWNER-0001');
  const [creatorPoints,setCreatorPoints]=useState(100000);
  const [creatorLevel,setCreatorLevel]=useState(8);
  const [connectedSocial,setConnectedSocial]=useState(false);
  const [creatorApplied,setCreatorApplied]=useState(false);
  const [creatorFollowers,setCreatorFollowers]=useState('');
  const [templateSearch,setTemplateSearch]=useState('');
  const [likedTemplates,setLikedTemplates]=useState([]);
  const [templateFeedCategory,setTemplateFeedCategory]=useState('For You');
  const [effectSearch,setEffectSearch]=useState('');
  const [mediaItems,setMediaItems]=useState([]);
  const [mediaFiles,setMediaFiles]=useState([]);
  const [exportFormat,setExportFormat]=useState('MP4');
  const [creatorTab,setCreatorTab]=useState('Overview');


  const historyRef=useRef([]);
  const redoRef=useRef([]);
  const clipboardRef=useRef(null);

  const today=()=>new Date().toLocaleDateString('en-CA');

  const saveHistory=useCallback(()=>{
    historyRef.current.push({clips,tool,playing});
    if(historyRef.current.length>40)historyRef.current.shift();
    redoRef.current=[];
  },[clips,tool,playing]);

  const undo=useCallback(()=>{
    const previous=historyRef.current.pop();
    if(!previous){setLastAction('Nothing to undo');return;}
    redoRef.current.push({clips,tool,playing});
    setClips(previous.clips);
    setTool(previous.tool);
    setPlaying(previous.playing);
    setLastAction('Undo completed');
  },[clips,tool,playing]);

  const redo=useCallback(()=>{
    const next=redoRef.current.pop();
    if(!next){setLastAction('Nothing to redo');return;}
    historyRef.current.push({clips,tool,playing});
    setClips(next.clips);
    setTool(next.tool);
    setPlaying(next.playing);
    setLastAction('Redo completed');
  },[clips,tool,playing]);

  const copyClip=useCallback(()=>{
    clipboardRef.current={clips};
    setLastAction('Clip copied');
  },[clips]);

  const pasteClip=useCallback(()=>{
    if(!clipboardRef.current){setLastAction('Nothing copied yet');return;}
    saveHistory();
    setClips(v=>v+1);
    setLastAction('Clip pasted');
  },[saveHistory]);

  const cutClip=useCallback(()=>{
    if(clips<=0){setLastAction('No clip selected');return;}
    saveHistory();
    clipboardRef.current={clips:1};
    setClips(v=>Math.max(0,v-1));
    setLastAction('Clip cut');
  },[clips,saveHistory]);

  const duplicateClip=useCallback(()=>{
    saveHistory();
    setClips(v=>v+1);
    setLastAction('Clip duplicated');
  },[saveHistory]);

  const deleteClip=useCallback(()=>{
    if(clips<=0){setLastAction('No clip selected');return;}
    saveHistory();
    setClips(v=>Math.max(0,v-1));
    setLastAction('Clip deleted');
  },[clips,saveHistory]);

  const importMedia=async(kind='all')=>{
    try{
      let assets=[];
      if(kind==='audio'){
        const result=await DocumentPicker.getDocumentAsync({type:'audio/*',multiple:true,copyToCacheDirectory:true});
        if(result.canceled)return;
        assets=(result.assets||[]).map(file=>({name:file.name||'Audio file',uri:file.uri,type:'audio',mimeType:file.mimeType||'audio/*'}));
      }else{
        const permission=await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(!permission.granted){setLastAction('Media library permission was not granted. Allow access in Android settings to import media.');return;}
        const mediaTypes=kind==='video'?['videos']:kind==='image'?['images']:['images','videos'];
        const result=await ImagePicker.launchImageLibraryAsync({mediaTypes,allowsMultipleSelection:true,quality:1,selectionLimit:0});
        if(result.canceled)return;
        assets=(result.assets||[]).map(file=>({name:file.fileName||file.uri?.split('/').pop()||'Media file',uri:file.uri,type:file.type||kind,mimeType:file.mimeType||null}));
      }
      if(!assets.length){setLastAction('No media selected');return;}
      setMediaFiles(current=>[...current,...assets]);
      setMediaItems(current=>[...current,...assets.map(file=>file.name)]);
      setClips(current=>current+assets.filter(file=>file.type==='video').length);
      setLastAction(assets.length+' media file(s) imported successfully');
      setModal('');
    }catch(error){setLastAction('Media import failed: '+String(error?.message||error));}
  };

  const chooseTool=name=>{
    saveHistory();
    setTool(name);
    setLastAction(name+' selected');
    if(name==='Split'){
      setClips(v=>v+1);
      setLastAction('Split action selected — demo timeline');
    }
    if(name==='Export')setModal('export');
    if(name==='Import'){setModal('import');setLastAction('Choose the media type to import');}
    if(name==='Frame Interpolation')setLastAction('Choose Frame Blending, Optical Flow or AI Frame Generation in Speed / Interpolation options');
    if(name==='Keyframe'){setKeyframeActive(true);setKeyframes(v=>v.some(k=>k.track===0&&k.at===Math.round(playhead))?v:[...v,{track:0,at:Math.round(playhead)}]);}
  };

  const chooseOption=option=>{
    saveHistory();
    setLastAction(option+' selected');
    if(tool==='Import'){
      if(option==='Choose video')return importMedia('video');
      if(option==='Choose image')return importMedia('image');
      if(option==='Choose audio')return importMedia('audio');
      if(option==='Import folder'){setLastAction('Folder import is not supported yet. Select individual media files.');return;}
    }
    if(tool==='Split'&&option==='Split at playhead')setClips(v=>v+1);
    if(tool==='Speed'&&option==='Frame Interpolation')setTool('Frame Interpolation');
    if(/120|240/.test(option)&&/FPS/.test(option))setFps(option.split('→').pop().trim());
    if(option==='Split at playhead'&&tool!=='Split')setClips(v=>v+1);
    if(tool==='Export'){
      if(option.includes('FPS'))setFps(option);
      else setResolution(option);
    }
  };

  const runShortcut=useCallback((key,ctrl,shift)=>{
    const k=key.toLowerCase();

    if(ctrl&&k==='c'){copyClip();return true;}
    if(ctrl&&k==='v'){pasteClip();return true;}
    if(ctrl&&k==='x'){cutClip();return true;}
    if(ctrl&&k==='z'){undo();return true;}
    if(ctrl&&k==='y'){redo();return true;}
    if(ctrl&&k==='d'){duplicateClip();return true;}
    if(ctrl&&k==='a'){setLastAction('All timeline clips selected');return true;}
    if(ctrl&&k==='s'){setLastAction('Save shortcut pressed');return true;}

    if(k===' '||k==='space'){
      setPlaying(v=>!v);
      setLastAction(playing?'Playback paused':'Playback started');
      return true;
    }
    if(k==='delete'||k==='backspace'){deleteClip();return true;}
    if(k==='escape'){setModal('');setDrawer(false);setShortcutPanel(false);return true;}
    if(k==='enter'){setLastAction('Enter pressed');return true;}

    if(!ctrl&&!shift&&SHORTCUTS[k]){
      chooseTool(SHORTCUTS[k]);
      return true;
    }
    if(!ctrl&&!shift&&k==='m'){
      chooseTool('Mask');
      return true;
    }
    return false;
  },[copyClip,pasteClip,cutClip,undo,redo,duplicateClip,deleteClip,playing]);

  useEffect(()=>{
    if(Platform.OS!=='android')return;
    const onHardwareBack=()=>{
      if(modal){setModal('');return true;}
      if(drawer){setDrawer(false);return true;}
      if(shortcutPanel){setShortcutPanel(false);return true;}
      if(page==='editor'||page!=='home'&&page!=='welcome'){setPage('home');return true;}
      // Keep the app on its dashboard instead of letting one Back press exit it.
      return true;
    };
    const subscription=BackHandler.addEventListener('hardwareBackPress',onHardwareBack);
    return ()=>subscription.remove();
  },[page,modal,drawer,shortcutPanel]);

  useEffect(()=>{
    if(Platform.OS!=='web')return;
    const handler=e=>{
      const target=e.target;
      const tag=target?.tagName?.toLowerCase();
      const typing=tag==='input'||tag==='textarea'||target?.isContentEditable;
      if(typing)return;

      const key=e.key;
      const ctrl=e.ctrlKey||e.metaKey;
      const handled=runShortcut(key,ctrl,e.shiftKey);
      if(handled)e.preventDefault();
    };
    if(typeof window!=='undefined'){
      window.addEventListener('keydown',handler);
      return ()=>window.removeEventListener('keydown',handler);
    }
  },[runShortcut]);

  useEffect(()=>{
    let mounted=true;
    const init=async()=>{
      try {
        const [p,cid,pts,photos]=await Promise.all([
          AsyncStorage.getItem('ERROR_PIXEL_PROJECTS'),
          AsyncStorage.getItem('ERROR_PIXEL_CREATOR_ID'),
          AsyncStorage.getItem('ERROR_PIXEL_CREATOR_POINTS'),
          AsyncStorage.getItem('ERROR_PIXEL_PHOTO_PROJECTS')
        ]);
        if(!mounted)return;
        if(p)setProjects(JSON.parse(p));
        if(cid)setCreatorId(cid);
        if(pts){const n=Number(pts)||0;setCreatorPoints(n);setCreatorLevel(CREATOR_LEVELS.filter(x=>n>=x.points).slice(-1)[0]?.level||1);}
        if(photos)setPhotoProjects(JSON.parse(photos));
        const active=await AsyncStorage.getItem('ERROR_PIXEL_ACTIVE_PROJECT');
        if(active){const saved=JSON.parse(active);if(saved&&saved.id){setSelectedProjectId(saved.id);setProjectName(saved.name||'Untitled Project');setClips(saved.clips==null?1:saved.clips);setTool(saved.tool||'Split');setFps(saved.fps||'60 FPS');setSpeed(saved.speed==null?1:saved.speed);setPlayhead(saved.playhead==null?50:saved.playhead);setKeyframes(saved.keyframes||[]);setResolution(saved.resolution||'1080p');setTrackCount(saved.trackCount||12);setMediaItems(saved.mediaItems||[]);setMediaFiles(saved.mediaFiles||[]);setExportFormat(saved.exportFormat||'MP4');}}
        setStorageReady(true);
      } catch(e){console.log('Storage init:',e);}
    };
    init();
    const timer=setTimeout(()=>{
      if(mounted)setPage('home');
    },2400);
    return ()=>{mounted=false;clearTimeout(timer);};
  },[]);

  const openSocial=async url=>{
    try{await Linking.openURL(url);}
    catch(e){console.log('Open link failed:',e);}
  };

  const saveProject=async()=>{
    const id=selectedProjectId||('EP-'+Date.now());
    const snapshot={id,name:projectName||'Untitled Project',date:new Date().toLocaleString(),clips,tool,fps,speed,playhead,keyframes,resolution,trackCount,mediaItems,mediaFiles,exportFormat,projectType,updatedAt:Date.now()};
    try{
      const next=[...projects.filter(p=>p.id!==id),snapshot];
      setSelectedProjectId(id);setProjects(next);
      await AsyncStorage.multiSet([['ERROR_PIXEL_PROJECTS',JSON.stringify(next)],['ERROR_PIXEL_ACTIVE_PROJECT',JSON.stringify(snapshot)],['ERROR_PIXEL_BACKUP',JSON.stringify({version:1,createdAt:Date.now(),project:snapshot})]]);
      setLastAction('Project and local backup saved');return true;
    }catch(e){setLastAction('Save failed: '+String(e&&e.message||e));return false;}
  };
  const openSavedProject=async p=>{
    if(!p)return;
    setSelectedProjectId(p.id||null);setProjectName(p.name||'Untitled Project');
    setClips(p.clips==null?1:p.clips);setTool(p.tool||'Split');setPlaying(false);
    setFps(p.fps||'60 FPS');setSpeed(p.speed==null?1:p.speed);setPlayhead(p.playhead==null?50:p.playhead);
    setKeyframes(p.keyframes||[]);setResolution(p.resolution||'1080p');setTrackCount(p.trackCount||12);
    setMediaItems(p.mediaItems||[]);setMediaFiles(p.mediaFiles||[]);setExportFormat(p.exportFormat||'MP4');
    try{await AsyncStorage.setItem('ERROR_PIXEL_ACTIVE_PROJECT',JSON.stringify(p));}catch(e){}
    setPage('editor');setLastAction('Project restored from device storage');
  };

  const menu=[
    ['Dashboard','home'],['Video Editor','editor'],['Photo Studio','photo'],['My Projects','projects'],['Templates','templates'],['Effects','effects'],['AI Model Library','aimodels'],['Creator Center','creator'],['Import Media','media'],['Membership','membership'],['Help Center','help']
  ];

  const visibleTools=TOOLS.filter(x=>(category==='All'||x[2]===category)&&x[0].toLowerCase().includes(toolSearch.toLowerCase()));
  const getToolOptions=name=>OPTIONS[name]||({
    Edit:['Apply to selected clip','Set in point','Set out point','Duplicate clip','Reset tool'],
    Motion:['Add keyframe','Ease in','Ease out','Open graph editor','Reset motion'],
    Color:['Auto correction','Adjust intensity','Apply to selected clip','Reset color'],
    Audio:['Apply to selected audio','Fade in','Fade out','Preview audio','Reset audio'],
    Effects:['Apply effect','Adjust strength','Preview effect','Remove effect'],
    Transitions:['Apply transition','Duration 0.5s','Duration 1.0s','Duration 2.0s'],
    Text:['Add text layer','Edit text','Choose font','Animate text'],
    Advanced:['Apply to selected layer','Track forward','Track backward','Reset analysis'],
    AI:['Choose AI model','Preview processing','Quality: High','AI service required'],
    Photo:['Apply to image','Adjust strength','Preview','Reset image'],
    Output:['Open export settings','Save preset','Export settings']
  }[TOOLS.find(x=>x[0]===name)?.[2]]||['Apply','Adjust settings','Reset tool']);
  const activeRank=CREATOR_LEVELS[Math.max(0,Math.min(7,creatorLevel-1))];
  const openTool=name=>{setPage('editor');chooseTool(name);};
  const addCreatorPoints=async amount=>{const n=creatorPoints+amount;setCreatorPoints(n);const rank=CREATOR_LEVELS.filter(x=>n>=x.points).slice(-1)[0]?.level||1;setCreatorLevel(rank);try{await AsyncStorage.multiSet([['ERROR_PIXEL_CREATOR_POINTS',String(n)],['ERROR_PIXEL_CREATOR_ID',creatorId]]);}catch(e){}};

  if(page==='welcome'){
    return (
      <SafeAreaView style={s.safe}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
        <View style={s.welcome}>
          <View style={s.ambient}/>
          <EPLogo size={166}/>
          <Text style={s.welcomeBrand}>ERROR <Text style={{color:C.violet}}>PIXEL</Text></Text>
          <Text style={s.tag}>PROFESSIONAL CREATIVE STUDIO</Text>
          <View style={s.loadingLine}>
            <ActivityIndicator color={C.cyan}/>
            <Text style={s.loadingText}>INITIALIZING CREATIVE STUDIO</Text>
          </View>
          <Text style={s.powered}>POWERED BY MUNEEB HASSAN</Text>
          <Text style={s.channel}>ERROR EDITX99</Text>
        </View>
      </SafeAreaView>
    );
  }

  const EditorTools=()=>(
    <View style={s.toolPanel}>
      <View style={s.toolPanelHead}>
        <View style={{flex:1}}>
          <Text style={s.eyebrow}>{TOOLS.find(x=>x[0]===tool)?.[2]?.toUpperCase()} TOOL</Text>
          <Text style={s.toolTitle}>{tool}</Text>
        </View>
        <Text style={s.smallMuted} numberOfLines={1}>{lastAction}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {getToolOptions(tool).map(x=>(
          <TouchableOpacity key={x} style={s.option} onPress={()=>chooseOption(x)}>
            <Text style={s.optionText}>{x}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const Timeline=({desktop=false})=>(
    <View style={[s.timelineBox,desktop&&s.desktopTimeline,desktop&&{
      height:'100%',flex:1,flexGrow:1,flexShrink:1,minHeight:0,marginHorizontal:0
    }]}>
      <View pointerEvents="none" style={[s.playheadOverlay,{left:playhead+'%'}]}>
        <View style={s.playheadSideLeft}/>
        <View style={s.playheadSideRight}/>
        <View style={s.playheadLine}/>
        <View style={s.playheadCap}/>
        <Text style={s.playheadLabel}>PLAYHEAD · SPLIT HERE</Text>
      </View>
      <View style={s.timelineHead}>
        <View>
          <Text style={s.eyebrow}>MULTI-TRACK SEQUENCE</Text>
          <Text style={s.sectionTitle}>Timeline</Text>
        </View>
        <TouchableOpacity onPress={()=>setTrackCount(v=>Math.min(v+1,20))}>
          <Text style={s.link}>＋ TRACK</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{minWidth:620}}>
          <View style={s.rulerInner}>
            {['00:00','00:03','00:06','00:09','00:12','00:15','00:18','00:21'].map((x,i)=>(
              <TouchableOpacity key={x} onPress={()=>{setPlayhead(i*100/7);setLastAction('Playhead moved to '+x);}}><Text style={[s.rulerText,Math.abs(playhead-i*100/7)<8&&{color:C.cyan}]}>{x}</Text></TouchableOpacity>
            ))}
          </View>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={true}
            style={desktop?{flex:1,minHeight:0}:{height:190,maxHeight:190,flexGrow:0}}>
            {Array.from({length:trackCount},(_,i)=>({
              name:['VIDEO 01','AUDIO','OVERLAY','EFFECTS','TEXT','VIDEO 02','VOICEOVER','MUSIC','CAPTIONS','GRAPHICS','MASK','ADJUSTMENT'][i],
              color:['#9877F4','#39A6A8','#C17BCB','#D39A55','#5D9BD8','#8064B8','#42A8A0','#BD8C4F','#6289C7','#9E6FA9','#A17A68','#4F9D8B'][i]
            })).map((x,i)=>(
              <View key={x.name} style={s.track}>
                <Text style={s.trackName}>{x.name}</Text>
                <View style={s.trackLane}>
                  <TouchableOpacity activeOpacity={.85} onPress={()=>{
                    setLastAction(x.name+' layer selected at '+Math.round(playhead)+'%');
                    if(keyframeActive)setKeyframes(v=>v.some(k=>k.track===i&&k.at===Math.round(playhead))?v:[...v,{track:i,at:Math.round(playhead)}]);
                  }} style={[s.clip,{
                    width:Math.min(150+clips*24,390),
                    backgroundColor:x.color
                  }]}>
                    <Text style={s.clipText}>{i===0?'VIDEO CLIP '+clips:x.name+' LAYER'}</Text>
                    {keyframes.filter(k=>k.track===i).map(k=><View key={k.at} style={[s.keyframeMarker,{left:(k.at/100)*Math.min(150+clips*24,390)}]}/>)}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );

  const PreviewMonitor=({desktop=false})=>(
    <View style={[s.preview,desktop&&s.desktopPreview,desktop&&{
      height:height<400?66:height<480?78:Math.max(105,Math.min(155,Math.floor(height*.30))),
      flexGrow:0,flexShrink:0
    }]}>
      <View style={s.previewMeta}>
        <Text style={s.eyebrow}>PREVIEW MONITOR</Text>
        <Text style={s.smallMuted}>{resolution} · {fps}</Text>
      </View>
      <View style={[s.previewCanvas,desktop&&s.desktopCanvas,desktop&&{
        height:undefined,minHeight:90,maxHeight:undefined,
        flexGrow:1,flexShrink:1,marginVertical:2,overflow:'hidden',width:'100%'
      }]}>
        {mediaFiles.length>0&&mediaFiles[0].uri ? (
          <Image source={{uri:mediaFiles[0].uri}} resizeMode="contain" style={{width:'100%',height:'100%',position:'absolute'}}/>
        ) : (
          <FogBrandPreview desktop={desktop}/>
        )}
      </View>

      <View style={s.previewControls}>
        <View style={s.previewTime}>
          <Text style={s.smallMuted}>00:00:00:00</Text>
          <Text style={s.smallMuted}>00:00:15:00</Text>
        </View>
        <View style={s.controlButtons}>
          <TouchableOpacity style={s.previewControl} onPress={undo}>
            <Text style={s.controlGlyph}>↶</Text>
            <Text style={s.controlLabel}>UNDO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.previewControl} onPress={redo}>
            <Text style={s.controlGlyph}>↷</Text>
            <Text style={s.controlLabel}>REDO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.previewControl,keyframeActive&&s.keyframeOn]}
            onPress={()=>{
              setKeyframeActive(v=>!v);
              setLastAction(keyframeActive?'Keyframe disabled':'Keyframe added');
            }}>
            <Text style={s.controlGlyph}>◇</Text>
            <Text style={s.controlLabel}>KEYFRAME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.previewControl,s.playControl]}
            onPress={()=>setPlaying(v=>!v)}>
            <Text style={s.controlGlyph}>{playing?'Ⅱ':'▶'}</Text>
            <Text style={s.controlLabel}>{playing?'PAUSE':'PLAY'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>

      {page==='home'&&(
        <View style={s.main}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:wide?26:13,paddingTop:10,paddingBottom:24}}>
            <View style={{flexDirection:wide?'row':'column',gap:wide?22:0}}>
              {wide&&(
                <View style={{width:205,alignItems:'center',paddingTop:28}}>
                  <View style={{width:124,height:124,alignItems:'center',justifyContent:'center',borderRadius:30,backgroundColor:'#080D25',borderWidth:2,borderColor:'#9C65FF',shadowColor:'#A34DFF',shadowOpacity:.9,shadowRadius:24,elevation:18}}>
                    <EPLogo size={96}/>
                  </View>
                  <Text style={{color:'#FFFFFF',fontSize:24,fontWeight:'900',fontStyle:'italic',marginTop:16}}>ERROR</Text>
                  <Text style={{color:'#32DFFF',fontSize:25,fontWeight:'900',fontStyle:'italic',marginTop:-5}}>PIXEL</Text>
                  <Text style={{color:'#D5E5FF',fontSize:11,marginTop:5}}>Professional Video Editor</Text>
                  {['Ultra HD Editing','Advanced Effects','AI Powered Tools','Pro Creative UI','Smooth Performance'].map((v,i)=>(
                    <View key={v} style={{width:'100%',flexDirection:'row',alignItems:'center',gap:9,marginTop:16}}>
                      <Text style={{color:'#52EFFF',fontSize:16}}>✓</Text><Text style={{color:'#EAF1FF',fontSize:10}}>{v}</Text>
                    </View>
                  ))}
                  <Text style={{color:'#6BEAFF',fontSize:15,fontStyle:'italic',marginTop:26}}>Edit Beyond Limits</Text>
                </View>
              )}
              <View style={{flex:1,minWidth:0}}>
                <View style={{height:48,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:5}}>
                  <TouchableOpacity onPress={()=>setDrawer(true)} style={{width:36,height:36,alignItems:'center',justifyContent:'center',borderRadius:12,backgroundColor:'#10152D',borderWidth:1,borderColor:'#765BCA'}}>
                    <Text style={{color:'#EAF5FF',fontSize:20}}>☰</Text>
                  </TouchableOpacity>
                  <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                    <EPLogo size={wide?36:40}/>
                    <Text style={{color:'#FFFFFF',fontSize:wide?17:19,fontWeight:'900',fontStyle:'italic'}}>ERROR <Text style={{color:'#31DFFF'}}>PIXEL</Text></Text>
                    <View style={{paddingHorizontal:9,paddingVertical:5,borderRadius:10,backgroundColor:'#24144F',borderWidth:1,borderColor:'#B76BFF'}}>
                      <Text style={{color:'#E8D9FF',fontSize:9,fontWeight:'900'}}>♛ PRO</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={()=>setModal('settings')} style={{width:36,height:36,alignItems:'center',justifyContent:'center',borderRadius:12,backgroundColor:'#10152D',borderWidth:1,borderColor:'#42CFF4'}}>
                    <Text style={{color:'#EAF5FF',fontSize:18}}>⚙</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity activeOpacity={.92} onPress={()=>{setProjectType('video');setPage('editor');}} style={{minHeight:wide?222:205,marginTop:8,padding:wide?20:16,borderRadius:22,overflow:'hidden',backgroundColor:'#080D26',borderWidth:1.5,borderTopColor:'#FFFFFF',borderLeftColor:'#A84DFF',borderRightColor:'#36E8FF',borderBottomColor:'#5938B7',shadowColor:'#8D35FF',shadowOpacity:.5,shadowRadius:23,elevation:15}}>
                  <View pointerEvents="none" style={{position:'absolute',right:-35,top:-48,width:230,height:230,borderRadius:115,backgroundColor:'rgba(117,35,255,.25)',borderWidth:1,borderColor:'rgba(90,213,255,.45)'}}/>
                  <View pointerEvents="none" style={{position:'absolute',right:55,bottom:-75,width:190,height:190,borderRadius:95,backgroundColor:'rgba(0,190,255,.15)',borderWidth:1,borderColor:'rgba(104,224,255,.3)'}}/>
                  <View pointerEvents="none" style={{position:'absolute',left:-24,bottom:20,width:190,height:74,transform:[{rotate:'-18deg'}],backgroundColor:'rgba(114,232,255,.045)',borderTopWidth:1,borderBottomWidth:1,borderColor:'rgba(114,232,255,.20)'}}/>
                  <View pointerEvents="none" style={{position:'absolute',right:18,top:20,width:70,height:70,borderRadius:35,borderWidth:1,borderColor:'rgba(255,255,255,.20)',backgroundColor:'rgba(198,141,255,.08)'}}/>
                  <View pointerEvents="none" style={{position:'absolute',left:'42%',top:0,bottom:0,width:1,backgroundColor:'rgba(255,255,255,.045)'}}/>
                  <View pointerEvents="none" style={{position:'absolute',left:14,right:14,bottom:13,height:1,backgroundColor:'rgba(120,222,255,.20)'}}/>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{color:'#69E9FF',fontSize:8,fontWeight:'900',letterSpacing:1.8}}>ERROR PIXEL · CREATIVE STUDIO</Text>
                    <Text style={{color:'#D7B7FF',fontSize:8,fontWeight:'900'}}>START A NEW PROJECT</Text>
                  </View>
                  <View style={{flexDirection:'row',alignItems:'center',flex:1,marginTop:13}}>
                    <View style={{flex:1}}>
                      <Text style={{color:'#FFFFFF',fontSize:wide?25:22,fontWeight:'900',fontFamily:'sans-serif-condensed',letterSpacing:.3,lineHeight:wide?30:26}}>Start Editing</Text>
                      <Text style={{color:'#FFFFFF',fontSize:wide?22:19,fontWeight:'900',fontFamily:'sans-serif-black',letterSpacing:.2,lineHeight:wide?27:23}}>Your Next Project</Text>
                      <Text style={{color:'#CBD9F7',fontSize:10,marginTop:7,lineHeight:15}}>Turn your ideas into stunning videos</Text>
                      <View style={{alignSelf:'flex-start',marginTop:13,paddingHorizontal:15,paddingVertical:9,borderRadius:22,backgroundColor:'#312078',borderWidth:1.5,borderTopColor:'#FFFFFF',borderLeftColor:'#D17BFF',borderRightColor:'#4CEBFF',borderBottomColor:'#5444C8',shadowColor:'#39DFFF',shadowOpacity:.65,shadowRadius:12,elevation:9}}>
                        <Text style={{color:'#FFFFFF',fontSize:10,fontWeight:'900'}}>⊕  NEW PROJECT  ›</Text>
                      </View>
                    </View>
                    <View style={{width:wide?180:126,height:wide?150:132,alignItems:'center',justifyContent:'center'}}>
                      <View style={{position:'absolute',width:wide?130:110,height:wide?130:110,borderRadius:25,transform:[{rotate:'-12deg'}],backgroundColor:'rgba(114,60,255,.20)',borderWidth:1.5,borderColor:'#A56DFF',shadowColor:'#4BDFFF',shadowOpacity:.7,shadowRadius:18,elevation:10}}/>
                      <Text style={{color:'#D3B9FF',fontSize:wide?68:57,textShadowColor:'#4E45FF',textShadowRadius:20}}>🎬</Text>
                      <Text style={{position:'absolute',top:7,right:8,color:'#55E9FF',fontSize:27}}>✦</Text>
                      <Text style={{position:'absolute',bottom:4,left:6,color:'#D2A4FF',fontSize:22}}>✧</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <View style={{flexDirection:'row',gap:8,marginTop:12}}>
                  {[
                    ['▦','Templates',()=>setPage('templates')],
                    ['▤','Projects',()=>setPage('projects')],
                    ['✧','AI Tools',()=>{setPage('editor');setTool('AI Video Enhancer');}],
                    ['•••','More',()=>setDrawer(true)]
                  ].map(([glyph,label,action],i)=>(
                    <TouchableOpacity key={label} onPress={action} style={{flex:1,minWidth:0,height:66,alignItems:'center',justifyContent:'center',borderRadius:15,backgroundColor:'#11172F',borderWidth:1.2,borderTopColor:'#FFFFFF',borderLeftColor:i%2?'#A65AFF':'#52DFFF',borderRightColor:i%2?'#51E7FF':'#A65AFF',borderBottomColor:'#403A83',shadowColor:i%2?'#9B55FF':'#37DFFF',shadowOpacity:.3,shadowRadius:12,elevation:7}}>
                      <Text style={{color:i%2?'#D8B4FF':'#6BEAFF',fontSize:23,fontWeight:'900',textShadowColor:i%2?'#9A4CFF':'#23DFFF',textShadowRadius:9}}>{glyph}</Text>
                      <Text style={{color:'#F1F4FF',fontSize:9,fontWeight:'900',marginTop:4}}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:19,marginBottom:10}}>
                  <View><Text style={{color:'#63E7FF',fontSize:8,fontWeight:'900',letterSpacing:1.5}}>GET INSPIRED</Text><Text style={{color:'#FFFFFF',fontSize:16,fontWeight:'900',fontFamily:'sans-serif-condensed',letterSpacing:.4,marginTop:3}}>Trending Templates</Text></View>
                  <TouchableOpacity onPress={()=>setPage('templates')}><Text style={{color:'#73E9FF',fontSize:10,fontWeight:'900'}}>See All ›</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:10,paddingBottom:4}}>
                  {[
                    ['CITY LIGHTS','▥','#182E68','#A54DFF'],
                    ['CRICKET EDIT','♛','#102D58','#0BE2EF'],
                    ['NEON PORTRAIT','✦','#35145E','#0A9DCB'],
                    ['CINEMATIC','◈','#12384E','#7443C5']
                  ].map(([name,glyph,bg,edge])=>(
                    <TouchableOpacity key={name} onPress={()=>{setProjectType('video');setPage('editor');}} style={{width:wide?155:122,height:wide?126:112,borderRadius:15,overflow:'hidden',alignItems:'center',justifyContent:'center',backgroundColor:bg,borderWidth:1.3,borderColor:edge,shadowColor:edge,shadowOpacity:.42,shadowRadius:12,elevation:7}}>
                      <View style={{position:'absolute',width:95,height:95,borderRadius:48,borderWidth:1,borderColor:edge,backgroundColor:'rgba(255,255,255,.035)'}}/>
                      <Text style={{color:'#FFFFFF',fontSize:42,textShadowColor:edge,textShadowRadius:16}}>{glyph}</Text>
                      <Text style={{position:'absolute',bottom:9,left:8,color:'#FFFFFF',fontSize:8,fontWeight:'900',letterSpacing:.6}}>{name}</Text>
                      <View style={{position:'absolute',right:8,bottom:7,width:20,height:20,borderRadius:10,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,.65)',borderWidth:1,borderColor:edge}}><Text style={{color:'#FFFFFF',fontSize:8}}>▶</Text></View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:17,marginBottom:9}}>
                  <View><Text style={{color:'#62E8FF',fontSize:8,fontWeight:'900',letterSpacing:1.4}}>YOUR CREATIVE SPACE</Text><Text style={{color:'#FFFFFF',fontSize:15,fontWeight:'900',marginTop:3}}>My Projects</Text></View>
                  <Text style={{color:'#AAB8D6',fontSize:9}}>{projects.length} PROJECTS</Text>
                </View>
                {projects.length===0?(
                  <TouchableOpacity onPress={()=>setPage('editor')} style={{padding:14,borderRadius:16,backgroundColor:'#0E1731',borderWidth:1,borderColor:'rgba(86,211,255,.48)',flexDirection:'row',alignItems:'center',gap:11}}>
                    <EPLogo size={42}/>
                    <View style={{flex:1}}><Text style={{color:'#FFFFFF',fontSize:11,fontWeight:'900'}}>Your projects will appear here</Text><Text style={{color:'#A6B7D9',fontSize:9,marginTop:4}}>Start a new edit and build your first project.</Text></View>
                    <Text style={{color:'#8BEAFF',fontSize:20}}>›</Text>
                  </TouchableOpacity>
                ):projects.slice(-3).reverse().map((p,i)=>(
                  <TouchableOpacity key={i} onPress={()=>setPage('editor')} style={{padding:13,marginBottom:8,borderRadius:15,backgroundColor:'#0E1731',borderWidth:1,borderColor:'rgba(86,211,255,.42)',flexDirection:'row',alignItems:'center',gap:10}}>
                    <EPLogo size={38}/><View style={{flex:1}}><Text style={{color:'#FFFFFF',fontSize:11,fontWeight:'900'}}>{p.name}</Text><Text style={{color:'#A6B7D9',fontSize:9,marginTop:3}}>{p.date}</Text></View><Text style={{color:'#8BEAFF',fontSize:9,fontWeight:'900'}}>OPEN ›</Text>
                  </TouchableOpacity>
                ))}
                <View style={{marginTop:20,marginBottom:4}}>
                  <Text style={{color:'#8CEBFF',fontSize:8,fontWeight:'900',letterSpacing:2,textAlign:'center'}}>FOLLOW THE CREATIVE JOURNEY</Text>
                  <Text style={{color:'#FFFFFF',fontSize:15,fontWeight:'900',fontFamily:'sans-serif-condensed',fontStyle:'italic',textAlign:'center',marginTop:4}}>ERROR PIXEL <Text style={{color:'#C89AFF'}}>SOCIALS</Text></Text>
                  <SocialDock onOpen={openSocial} wide={wide}/>
                  <Text style={{color:'#8295BA',fontSize:8,textAlign:'center',marginTop:7,letterSpacing:1}}>TIKTOK · INSTAGRAM · YOUTUBE · FACEBOOK</Text>
                </View>
                <View style={{marginTop:14,padding:13,borderRadius:16,backgroundColor:'#171337',borderWidth:1,borderColor:'rgba(167,139,250,.55)',flexDirection:'row',alignItems:'center',gap:11}}>
                  <EPLogo size={42}/><View style={{flex:1}}><Text style={{color:'#FFFFFF',fontSize:10,fontWeight:'900'}}>POWERED BY MUNEEB HASSAN</Text><Text style={{color:'#A9B9D8',fontSize:8,marginTop:4}}>ERROR EDITX99 · CREATOR LEVEL {activeRank.name}</Text></View><Text style={{color:'#C6A8FF',fontSize:20}}>♛</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          {!wide&&(
            <View style={{height:62,flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingHorizontal:8,backgroundColor:'#070B1C',borderTopWidth:1,borderTopColor:'rgba(103,194,255,.48)'}}>
              {[
                ['⌂','Home','home'],['▦','Templates','templates'],['▤','Projects','projects'],['◉','Me','creator']
              ].map(([glyph,label,target])=>(
                <TouchableOpacity key={label} onPress={()=>target==='home'?setPage('home'):target==='templates'?setPage('templates'):target==='projects'?setPage('projects'):setPage('creator')} style={{flex:1,alignItems:'center',justifyContent:'center',height:56}}>
                  <Text style={{color:target==='home'?'#79E9FF':'#8798BD',fontSize:22,fontWeight:'900',textShadowColor:target==='home'?'#28CFFF':'transparent',textShadowRadius:8}}>{glyph}</Text>
                  <Text style={{color:target==='home'?'#8BEAFF':'#A9B8D5',fontSize:8,fontWeight:target==='home'?'900':'600',marginTop:2}}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {page==='editor'&&(
        <View style={s.main}>
          {!landscape&&(
            <View style={s.editorTop}>
              <RoundButton onPress={()=>setPage('home')}>
                <Text style={s.buttonGlyph}>‹</Text>
              </RoundButton>
              <View style={{flex:1}}>
                <Text style={s.eyebrow}>CAPCUT STYLE MOBILE EDITOR</Text>
                <Text style={s.projectName}>{projectName}</Text>
              </View>
              <TouchableOpacity style={s.shortcutTop} onPress={()=>setShortcutPanel(true)}>
                <Text style={s.exportTopText}>⌨ SHORTCUTS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.exportTop} onPress={()=>setModal('export')}>
                <Text style={s.exportTopText}>EXPORT ↑</Text>
              </TouchableOpacity>
            </View>
          )}

          {landscape?(
            <View style={{flex:1,minHeight:0,backgroundColor:'#030713',paddingHorizontal:5,paddingTop:3,paddingBottom:4}}>
              <View style={{height:39,flexDirection:'row',alignItems:'center',paddingHorizontal:8,marginBottom:5,backgroundColor:'rgba(8,15,34,.96)',borderWidth:1,borderTopColor:'rgba(255,255,255,.72)',borderLeftColor:'#A66BFF',borderRightColor:'#54E8FF',borderBottomColor:'rgba(94,118,190,.7)',borderRadius:12,overflow:'hidden'}}>
                <EPLogo size={31}/>
                <View style={{marginLeft:7,width:142}}>
                  <Text style={{color:'#F7FAFF',fontSize:12,fontWeight:'900',fontStyle:'italic'}}>ERROR <Text style={{color:'#8C9CFF'}}>PIXEL</Text></Text>
                  <Text style={{color:'#B9C8E8',fontSize:6,letterSpacing:1.1}}>PROFESSIONAL VIDEO EDITOR</Text>
                </View>
                <TouchableOpacity style={{height:27,paddingHorizontal:10,justifyContent:'center',borderRadius:9,borderWidth:1,borderColor:'rgba(112,222,255,.7)',backgroundColor:'rgba(70,160,230,.12)'}} onPress={()=>setLastAction('Aspect ratio: 16:9')}>
                  <Text style={{color:'#F4F8FF',fontSize:8,fontWeight:'800'}}>16:9⌄</Text>
                </TouchableOpacity>
                <View style={{flex:1}}/>
                <TouchableOpacity onPress={undo} style={{paddingHorizontal:9}}><Text style={{color:'#E8F2FF',fontSize:20}}>↶</Text></TouchableOpacity>
                <TouchableOpacity onPress={redo} style={{paddingHorizontal:9}}><Text style={{color:'#E8F2FF',fontSize:20}}>↷</Text></TouchableOpacity>
                <View style={{flex:1}}/>
                <TouchableOpacity onPress={()=>setModal('export')} style={{height:29,paddingHorizontal:15,justifyContent:'center',borderRadius:10,borderWidth:1,borderTopColor:'#FFFFFF',borderLeftColor:'#C28BFF',borderRightColor:'#67E9FF',borderBottomColor:'#586EAA',backgroundColor:'rgba(96,85,220,.26)'}}>
                  <Text style={{color:'#FFFFFF',fontSize:8,fontWeight:'900'}}>⇧ EXPORT</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setModal('settings')} style={{paddingHorizontal:10}}><Text style={{color:'#EAF3FF',fontSize:17}}>⚙</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>setShortcutPanel(v=>!v)} style={{paddingHorizontal:6}}><Text style={{color:'#EAF3FF',fontSize:17}}>⛶</Text></TouchableOpacity>
              </View>

              <View style={{flex:1,minHeight:0,flexDirection:'row',gap:5}}>
                <View style={{width:43,justifyContent:'space-around',alignItems:'center',paddingVertical:5,backgroundColor:'rgba(8,15,35,.94)',borderRadius:10,borderWidth:1,borderColor:'rgba(96,180,255,.36)'}}>
                  {[
                    ['⌂','Home','home'],['▶','Media','media'],['♫','Audio','audio'],['T','Text','text'],['☆','Effects','effects'],['◀▶','Transitions','transitions'],['⬡','Elements','elements'],['✧','AI Tools','ai']
                  ].map(([g,label,key])=>(
                    <TouchableOpacity key={key} onPress={()=>key==='Home'?setPage('home'):chooseTool(key==='Media'?'Import':label)} style={{width:38,height:34,alignItems:'center',justifyContent:'center',borderRadius:8,backgroundColor:key==='Home'?'rgba(73,145,255,.22)':'transparent',borderWidth:key==='Home'?1:0,borderColor:'#6CEBFF'}}>
                      <Text style={{color:key==='Home'?'#8DF2FF':'#DCE8FF',fontSize:15,fontWeight:'900'}}>{g}</Text>
                      <Text style={{color:'#D7E2F7',fontSize:5.5,marginTop:1}}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={{width:154,minWidth:125,minHeight:0,padding:7,borderRadius:11,backgroundColor:'rgba(10,19,42,.95)',borderWidth:1,borderTopColor:'rgba(255,255,255,.6)',borderLeftColor:'#A77BFF',borderRightColor:'#5DE6FF',borderBottomColor:'rgba(85,110,170,.7)'}}>
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                    <Text style={{color:'#F5F8FF',fontSize:9,fontWeight:'900'}}>Media Library</Text>
                    <Text style={{color:'#8CEBFF',fontSize:13}}>⌕</Text>
                  </View>
                  <View style={{flexDirection:'row',gap:3,marginBottom:6}}>
                    {['All','Videos','Photos','Audio'].map((x,i)=><TouchableOpacity key={x} onPress={()=>setMediaSearch(i===0?'':x.toLowerCase().replace('s',''))} style={{flex:1,alignItems:'center',paddingVertical:5,borderRadius:6,backgroundColor:i===0?'rgba(100,75,255,.38)':'rgba(255,255,255,.045)',borderWidth:1,borderColor:i===0?'#6D83FF':'rgba(150,180,230,.18)'}}><Text style={{color:'#EAF2FF',fontSize:6.5,fontWeight:'800'}}>{x}</Text></TouchableOpacity>)}
                  </View>
                  <TouchableOpacity onPress={()=>{setTool('Import');setModal('import');}} style={{height:27,alignItems:'center',justifyContent:'center',borderRadius:7,marginBottom:6,backgroundColor:'rgba(83,166,239,.17)',borderWidth:1,borderColor:'rgba(106,224,255,.65)'}}>
                    <Text style={{color:'#F4FAFF',fontSize:7,fontWeight:'900'}}>＋ IMPORT MEDIA</Text>
                  </TouchableOpacity>
                  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{gap:5}}>
                    {mediaFiles.filter(x=>!mediaSearch||String(x.type).toLowerCase().includes(mediaSearch)).map((item,i)=>(
                      <TouchableOpacity key={item.uri||item.name+i} onPress={()=>setLastAction(item.name+' selected')} style={{height:48,borderRadius:7,overflow:'hidden',backgroundColor:'rgba(255,255,255,.06)',borderWidth:1,borderColor:'rgba(100,202,255,.35)'}}>
                        {item.uri&&item.type!=='audio'?<Image source={{uri:item.uri}} resizeMode="cover" style={{width:'100%',height:'100%'}}/>:<View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text style={{color:'#AFA0FF',fontSize:18}}>{item.type==='audio'?'♫':'◇'}</Text></View>}
                        <View style={{position:'absolute',bottom:0,left:0,right:0,padding:3,backgroundColor:'rgba(3,7,18,.8)'}}><Text numberOfLines={1} style={{color:'#FFF',fontSize:6}}>{item.name}</Text></View>
                      </TouchableOpacity>
                    ))}
                    {mediaFiles.length===0&&<View style={{flex:1,minHeight:105,alignItems:'center',justifyContent:'center',paddingHorizontal:5}}>
                      <Text style={{color:'#7F9EFF',fontSize:25}}>▣</Text>
                      <Text style={{color:'#F1F5FF',fontSize:8,fontWeight:'800',marginTop:6}}>No Media Files</Text>
                      <Text style={{color:'#9AAACB',fontSize:6,textAlign:'center',marginTop:3}}>Import media to get started</Text>
                    </View>}
                  </ScrollView>
                  <Text style={{color:'#7D91B8',fontSize:6,marginTop:5}}>{mediaFiles.length} ASSETS · LOCAL</Text>
                </View>

                <View style={{flex:1,minWidth:0,minHeight:0,gap:4}}>
                  <View style={{flex:1,minHeight:0,padding:6,borderRadius:11,backgroundColor:'rgba(7,15,34,.96)',borderWidth:1,borderTopColor:'rgba(255,255,255,.65)',borderLeftColor:'#A56BFF',borderRightColor:'#52E8FF',borderBottomColor:'rgba(91,113,179,.7)'}}>
                    <View style={{flex:1,minHeight:0,alignItems:'center',justifyContent:'center',borderRadius:7,backgroundColor:'#030918',borderWidth:1,borderColor:'rgba(105,174,255,.3)',overflow:'hidden'}}>
                      {mediaFiles.find(x=>x.type!=='audio'&&x.uri)?(
                        <Image source={{uri:mediaFiles.find(x=>x.type!=='audio'&&x.uri).uri}} resizeMode="contain" style={{width:'100%',height:'100%'}}/>
                      ):(
                        <View style={{alignItems:'center',justifyContent:'center'}}>
                          <EPLogo size={58}/>
                          <Text style={{color:'#FFFFFF',fontSize:17,fontWeight:'900',fontStyle:'italic',marginTop:9}}>ERROR <Text style={{color:'#69DFFF'}}>PIXEL</Text></Text>
                          <Text style={{color:'#B8C7E8',fontSize:7,letterSpacing:2,marginTop:3}}>EDIT · CREATE · INSPIRE</Text>
                          <Text style={{color:'#83E9FF',fontSize:8,marginTop:8}}>Import media to begin</Text>
                        </View>
                      )}
                    </View>
                    <View style={{height:32,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10}}>
                      <Text style={{color:'#DCE8FF',fontSize:7}}>00:00:00 / 00:00:00</Text>
                      <TouchableOpacity onPress={()=>setPlayhead(v=>Math.max(0,v-1))}><Text style={{color:'#E9F2FF',fontSize:15}}>◀</Text></TouchableOpacity>
                      <TouchableOpacity onPress={()=>setPlaying(v=>!v)} style={{width:31,height:27,alignItems:'center',justifyContent:'center',borderRadius:9,backgroundColor:'rgba(64,151,255,.3)',borderWidth:1,borderColor:'#64E8FF'}}><Text style={{color:'#FFF',fontSize:14}}>{playing?'Ⅱ':'▶'}</Text></TouchableOpacity>
                      <TouchableOpacity onPress={()=>setPlayhead(v=>Math.min(100,v+1))}><Text style={{color:'#E9F2FF',fontSize:15}}>▶</Text></TouchableOpacity>
                      <TouchableOpacity onPress={()=>setLastAction('Preview expanded')}><Text style={{color:'#E9F2FF',fontSize:13}}>⛶</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={{width:185,minWidth:150,minHeight:0,padding:7,borderRadius:11,backgroundColor:'rgba(10,19,42,.96)',borderWidth:1,borderTopColor:'rgba(255,255,255,.6)',borderLeftColor:'#9E7AFF',borderRightColor:'#56E5FF',borderBottomColor:'rgba(85,110,170,.7)'}}>
                  <View style={{flexDirection:'row',gap:3,marginBottom:7}}>
                    {['Properties','Effects','Adjustment'].map((x,i)=><TouchableOpacity key={x} onPress={()=>setCategory(x)} style={{flex:1,alignItems:'center',paddingVertical:6,borderRadius:7,backgroundColor:(i===0?'Properties':category)===x?'rgba(82,139,255,.22)':'rgba(255,255,255,.035)',borderBottomWidth:2,borderBottomColor:(i===0?'Properties':category)===x?'#6DEBFF':'transparent'}}><Text style={{color:'#E8F1FF',fontSize:6,fontWeight:'800'}}>{x}</Text></TouchableOpacity>)}
                  </View>
                  <Text style={{color:'#F4F7FF',fontSize:8,fontWeight:'900',marginBottom:7}}>✣ Transform</Text>
                  {['Position X','Position Y','Scale','Rotation','Opacity'].map((x,i)=>(
                    <View key={x} style={{height:27,flexDirection:'row',alignItems:'center',gap:4}}>
                      <Text style={{width:54,color:'#D9E4F8',fontSize:6.5}}>{x}</Text>
                      <View style={{flex:1,height:3,borderRadius:3,backgroundColor:'#25365E'}}><View style={{width:['52%','48%','35%','50%','90%'][i],height:3,backgroundColor:'#A35CFF',borderRadius:3}}/></View>
                      <Text style={{width:30,color:'#EAF3FF',fontSize:6.5,textAlign:'right'}}>{['540','360','100%','0°','100%'][i]}</Text>
                    </View>
                  ))}
                  <View style={{height:1,backgroundColor:'rgba(143,177,235,.2)',marginVertical:5}}/>
                  {['Color Correction','Background Blur','AI Enhance'].map((x,i)=><TouchableOpacity key={x} onPress={()=>chooseTool(x)} style={{height:27,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'rgba(132,166,224,.13)'}}><Text style={{color:'#E4EDFF',fontSize:6.5}}>{['◉','♦','✦'][i]}  {x}</Text><Text style={{color:'#8BEAFF',fontSize:12}}>›</Text></TouchableOpacity>)}
                  <View style={{height:1,backgroundColor:'rgba(143,177,235,.2)',marginVertical:6}}/>
                  <Text style={{color:'#8BEAFF',fontSize:7,fontWeight:'900',marginBottom:5}}>{tool.toUpperCase()} OPTIONS</Text>
                  <ScrollView style={{maxHeight:Math.max(90,Math.min(190,Math.round(height*.23)))}} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                    {getToolOptions(tool).map(option=><TouchableOpacity key={option} onPress={()=>chooseOption(option)} style={{minHeight:25,justifyContent:'center',paddingVertical:4,borderBottomWidth:1,borderBottomColor:'rgba(132,166,224,.13)'}}><Text style={{color:'#E4EDFF',fontSize:6.5}}>{option}</Text></TouchableOpacity>)}
                  </ScrollView>
                  <Text style={{color:'#8FA1C6',fontSize:6,marginTop:6}}> {resolution} · {fps}</Text>
                </View>
              </View>

              <View style={{height:Math.max(112,Math.min(150,Math.round(height*.255))),flexShrink:0,marginTop:4,padding:5,borderRadius:10,backgroundColor:'rgba(7,15,34,.97)',borderWidth:1,borderTopColor:'rgba(255,255,255,.6)',borderLeftColor:'#A46DFF',borderRightColor:'#55E7FF',borderBottomColor:'rgba(86,108,172,.7)'}}>
                <View style={{height:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                  <View style={{flexDirection:'row',gap:10}}>
                    <TouchableOpacity onPress={undo}><Text style={{color:'#EAF2FF',fontSize:14}}>↶</Text></TouchableOpacity>
                    <TouchableOpacity onPress={redo}><Text style={{color:'#EAF2FF',fontSize:14}}>↷</Text></TouchableOpacity>
                    <TouchableOpacity onPress={deleteClip}><Text style={{color:'#EAF2FF',fontSize:14}}>▤</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>chooseTool('Split')}><Text style={{color:'#EAF2FF',fontSize:14}}>✂</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>chooseTool('Import')}><Text style={{color:'#EAF2FF',fontSize:14}}>⊞</Text></TouchableOpacity>
                  </View>
                  <Text style={{color:'#8BEAFF',fontSize:6,fontWeight:'900'}}>TIMELINE · {mediaFiles.length} MEDIA</Text>
                  <TouchableOpacity onPress={()=>setTrackCount(v=>Math.min(v+1,12))}><Text style={{color:'#8BEAFF',fontSize:7}}>＋ TRACK</Text></TouchableOpacity>
                </View>
                <View style={{flex:1,minHeight:0}}>
                  {['Video 1','Video 2','Audio 1','Audio 2'].map((x,i)=>(
                    <View key={x} style={{height:'25%',minHeight:13,flexDirection:'row',alignItems:'center',borderTopWidth:1,borderTopColor:'rgba(119,153,218,.16)'}}>
                      <View style={{width:76,flexDirection:'row',alignItems:'center',gap:5}}><Text style={{color:'#91A5CC',fontSize:8}}>{['▣','▧','♫','≋'][i]}</Text><Text style={{color:'#DCE7FB',fontSize:6.5}}>{x}</Text></View>
                      <View style={{flex:1,height:'76%',borderRadius:4,overflow:'hidden',backgroundColor:i<2?'rgba(56,112,201,.12)':i===2?'rgba(23,190,135,.14)':'rgba(137,72,225,.14)',borderWidth:1,borderColor:i===2?'rgba(34,232,177,.68)':i===3?'rgba(174,104,255,.72)':'rgba(102,185,255,.62)',flexDirection:'row',alignItems:'center',paddingHorizontal:4}}>
                        {mediaFiles.length>0?(
                          <Text numberOfLines={1} style={{color:i===2?'#71F0C8':i===3?'#D4A5FF':'#B9E9FF',fontSize:6,fontWeight:'900'}}>{mediaFiles.filter(m=>i===0?m.type!=='audio':i===1?m.type==='image':i===2?m.type==='audio':m.type==='audio').map(m=>m.name).join('  ·  ')||'Empty track'}</Text>
                        ):<Text style={{color:i===2?'#53E9BC':i===3?'#C18CFF':'#8ACFFF',fontSize:6,fontWeight:'800'}}>{i<2?'DROP VIDEO / IMAGE CLIPS HERE':'DROP AUDIO CLIPS HERE'}</Text>}
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View style={{height:58,flexShrink:0,marginTop:3,paddingHorizontal:4,paddingVertical:3,borderRadius:11,backgroundColor:'rgba(19,28,59,.97)',borderWidth:1.3,borderTopColor:'rgba(255,255,255,.86)',borderLeftColor:'#A66BFF',borderRightColor:'#55E8FF',borderBottomColor:'rgba(86,108,172,.9)',shadowColor:'#6DE8FF',shadowOpacity:.32,shadowRadius:13,elevation:10}}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems:'center',gap:5,paddingHorizontal:2}}>
                  {['Edit','Audio','Text','Effects','Transitions','Color','Motion','AI','Photo','Advanced','Output'].map(x=>(
                    <TouchableOpacity key={x} onPress={()=>setCategory(x)} style={{paddingHorizontal:10,paddingVertical:5,borderRadius:10,backgroundColor:category===x?'rgba(111,118,255,.42)':'rgba(255,255,255,.045)',borderWidth:1,borderTopColor:'rgba(255,255,255,.65)',borderLeftColor:'rgba(171,145,255,.55)',borderRightColor:'rgba(92,228,255,.55)',borderBottomColor:'rgba(79,91,159,.8)'}}>
                      <Text style={{color:category===x?'#FFFFFF':'#BFCDEB',fontSize:7,fontWeight:'900'}}>{x.toUpperCase()}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems:'center',gap:5,paddingHorizontal:2,paddingTop:4}}>
                  {TOOLS.filter(x=>x[2]===category).map(x=>(
                    <TouchableOpacity key={x[0]} onPress={()=>chooseTool(x[0])} style={{width:64,minWidth:64,height:38,paddingHorizontal:4,flexShrink:0,alignItems:'center',justifyContent:'center',borderRadius:9,overflow:'hidden',backgroundColor:tool===x[0]?'rgba(55,177,255,.34)':'rgba(20,28,59,.92)',borderWidth:1.2,borderTopColor:'rgba(255,255,255,.96)',borderLeftColor:'rgba(174,145,255,.86)',borderRightColor:'rgba(91,226,255,.92)',borderBottomColor:'rgba(75,88,155,.98)',shadowColor:tool===x[0]?'#62E8FF':'#8D75FF',shadowOpacity:tool===x[0]?.72:.34,shadowRadius:tool===x[0]?13:8,elevation:tool===x[0]?10:6}}>
                      <Text numberOfLines={1} style={{color:tool===x[0]?'#FFFFFF':'#8FEFFF',fontSize:14,fontWeight:'900',textShadowColor:'#4C8EFF',textShadowRadius:7}}>{x[1]}</Text>
                      <Text numberOfLines={1} style={{color:tool===x[0]?'#FFFFFF':'#DDE8FF',fontSize:6.5,fontWeight:'900',marginTop:2}}>{x[0]}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          ):(            <View style={s.mobileEditor}>
              <PreviewMonitor/>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',marginHorizontal:9,marginTop:2,marginBottom:5,paddingVertical:8,borderRadius:12,backgroundColor:'rgba(18,22,42,.96)',borderWidth:1,borderColor:C.line}}>
                {[
                  ['＋','ADD MEDIA','Import'],
                  ['♫','AUDIO','Audio'],
                  ['T','TEXT','Text'],
                  ['✧','EFFECTS','Effects']
                ].map(([glyph,label,name])=>(
                  <TouchableOpacity key={label} onPress={()=>chooseTool(name)} style={{alignItems:'center',minWidth:58}}>
                    <Text style={{color:C.cyan,fontSize:18,fontWeight:'900'}}>{glyph}</Text>
                    <Text style={{color:C.white,fontSize:7,fontWeight:'900',marginTop:3}}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Timeline/>
              <View style={s.toolDock}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.mobileCategories}>
                  {['Edit','Audio','Text','Effects','Color','AI','Output'].map(x=>(
                    <TouchableOpacity key={x} onPress={()=>setCategory(x)} style={[s.mobileCategory,category===x&&s.categoryActive]}>
                      <Text style={[s.categoryText,category===x&&{color:C.cyan}]}>{x}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.toolList}>
                  {visibleTools.map(x=>(
                    <ToolButton key={x[0]} item={x} active={tool===x[0]} onPress={()=>chooseTool(x[0])}/>
                  ))}
                </ScrollView>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.mobileOptionList}>
                  {getToolOptions(tool).map(option=>(
                    <TouchableOpacity key={option} style={s.mobileOption} onPress={()=>chooseOption(option)}>
                      <Text style={s.mobileOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}
        </View>
      )}

      {page!=='home'&&page!=='editor'&&(
        <View style={s.main}>
          <View style={s.subHeader}>
            <RoundButton onPress={()=>setPage('home')}>
              <Text style={s.buttonGlyph}>‹</Text>
            </RoundButton>
            <Text style={s.subTitle}>{menu.find(x=>x[1]===page)?.[0]?.toUpperCase()||page.toUpperCase()}</Text>
            <RoundButton onPress={()=>setDrawer(true)}>
              <Text style={s.buttonGlyph}>•••</Text>
            </RoundButton>
          </View>

          {page==='photo'&&(
            <ScrollView contentContainerStyle={s.subContent}>
              <View style={s.photoCanvas}>
                <EPLogo size={80}/>
                <Text style={s.projectName}>PHOTO STUDIO</Text>
                <Text style={s.smallMuted}>Professional visual workspace</Text>
              </View>
              <View style={s.quickGrid}>
                {TOOL_GROUPS.Photo.map(x=>(
                  <TouchableOpacity key={x} style={s.option} onPress={()=>{setPage('editor');chooseTool(x);}}>
                    <Text style={s.optionText}>{x}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={s.connectButton} onPress={async()=>{const next=[...photoProjects,{name:'Photo Project '+(photoProjects.length+1),date:new Date().toLocaleDateString()}];setPhotoProjects(next);try{await AsyncStorage.setItem('ERROR_PIXEL_PHOTO_PROJECTS',JSON.stringify(next));}catch(e){}setLastAction('Photo project saved locally');}}><Text style={s.claimText}>SAVE PHOTO PROJECT</Text></TouchableOpacity>
              <Text style={s.statsNote}>Photo projects are stored separately from video projects on this device. Cloud sync requires backend setup.</Text>
            </ScrollView>
          )}

          {page==='projects'&&(
            <ScrollView contentContainerStyle={s.subContent}>
              {projects.length===0?(
                <View style={s.emptyCard}>
                  <EPLogo size={60}/>
                  <Text style={s.emptyTitle}>No saved projects yet</Text>
                  <Text style={s.smallMuted}>Create a project to see it here.</Text>
                  <TouchableOpacity style={s.connectButton} onPress={()=>setPage('editor')}>
                    <Text style={s.claimText}>CREATE PROJECT</Text>
                  </TouchableOpacity>
                </View>
              ):projects.map((p,i)=>(
                <TouchableOpacity key={i} style={s.projectRow} onPress={()=>setPage('editor')}>
                  <EPLogo size={42}/>
                  <View style={{flex:1}}>
                    <Text style={s.helpTitle}>{p.name}</Text>
                    <Text style={s.smallMuted}>{p.date}</Text>
                  </View>
                  <Text style={s.link}>OPEN ↗</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {page==='media'&&(
            <ScrollView contentContainerStyle={s.subContent}>
              <TextInput value={mediaSearch} onChangeText={setMediaSearch} placeholder="Search videos, photos, audio and projects..." placeholderTextColor={C.muted} style={s.nameInput}/>
              <TouchableOpacity style={s.connectButton} onPress={()=>importMedia('all')}><Text style={s.claimText}>＋ IMPORT MEDIA</Text></TouchableOpacity>
              <Text style={s.statsNote}>Select videos and photos from your device. Audio files can be imported from the editor's Import tool.</Text>
              {mediaItems.filter(x=>x.toLowerCase().includes(mediaSearch.toLowerCase())).map(x=><Text key={x} style={s.optionText}>{x}</Text>)}
            </ScrollView>
          )}
          {page==='templates'&&(
            <View style={{flex:1,minHeight:0,backgroundColor:'#070A16'}}>
              <View style={{paddingHorizontal:12,paddingTop:8,paddingBottom:7}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                  <Text style={{color:'#FFFFFF',fontSize:17,fontWeight:'900'}}>TEMPLATE FEED</Text>
                  <TouchableOpacity onPress={()=>setModal('import')} style={{paddingHorizontal:12,paddingVertical:7,borderRadius:18,backgroundColor:'#28205A',borderWidth:1,borderColor:'#70E8FF'}}>
                    <Text style={{color:'#FFFFFF',fontSize:9,fontWeight:'900'}}>＋ UPLOAD</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{color:'#93A5C9',fontSize:8,marginTop:3}}>Scroll through creator-style previews and choose a category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:7,paddingTop:9}}>
                  {['For You','Trending','New','Video','Reels','Sports','Transitions','Photo'].map(name=>(
                    <TouchableOpacity key={name} onPress={()=>setTemplateFeedCategory(name)} style={{paddingHorizontal:13,paddingVertical:7,borderRadius:18,backgroundColor:templateFeedCategory===name?'rgba(93,213,255,.22)':'rgba(255,255,255,.055)',borderWidth:1,borderColor:templateFeedCategory===name?'#6CEBFF':'rgba(139,157,205,.28)'}}>
                      <Text style={{color:templateFeedCategory===name?'#FFFFFF':'#B8C6E3',fontSize:8,fontWeight:'900'}}>{name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems:'center',paddingHorizontal:12,paddingBottom:22,gap:15}}>
                {[
                  {name:'CITY LIGHTS',creator:'ERROR EDITX99',tag:'Cinematic · Beat Sync',glyph:'▥',a:'#182E68',b:'#A54DFF',kind:'Video'},
                  {name:'CRICKET EDIT',creator:'SPORTS CREATOR',tag:'Sports · Velocity',glyph:'♛',a:'#102D58',b:'#0BE2EF',kind:'Sports'},
                  {name:'NEON PORTRAIT',creator:'CREATIVE PACK',tag:'Portrait · Glow',glyph:'✦',a:'#35145E',b:'#0A9DCB',kind:'Photo'},
                  {name:'TRAVEL REEL',creator:'REEL STUDIO',tag:'Travel · Transitions',glyph:'✈',a:'#18385C',b:'#50D9EF',kind:'Reels'},
                  {name:'GOLD LUXE',creator:'CREATOR PACKS',tag:'Luxury · Intro',glyph:'♛',a:'#40301B',b:'#E9D39F',kind:'Transitions'}
                ].filter(item=>templateFeedCategory==='For You'||templateFeedCategory==='Trending'||templateFeedCategory==='New'||item.kind===templateFeedCategory||templateFeedCategory==='Video'&&item.kind==='Video'||templateFeedCategory==='Transitions'&&item.kind==='Transitions').map((item,index)=>(
                  <View key={item.name} style={{width:'100%',maxWidth:390,flexDirection:'row',alignItems:'center',gap:9,padding:8,borderRadius:17,backgroundColor:'#11182C',borderWidth:1,borderColor:'rgba(120,185,255,.28)'}}>
                    <TouchableOpacity activeOpacity={.9} onPress={()=>{setProjectType('video');setProjectName(item.name+' Project');setPage('editor');setLastAction(item.name+' preview selected — editable template package is not connected yet');}} style={{width:205,maxWidth:'72%',aspectRatio:9/16,borderRadius:12,overflow:'hidden',backgroundColor:item.a,borderWidth:1.2,borderColor:item.b,alignItems:'center',justifyContent:'center'}}>
                      <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:item.a}}/>
                      <View style={{position:'absolute',width:175,height:175,borderRadius:90,borderWidth:2,borderColor:item.b,backgroundColor:'rgba(255,255,255,.035)'}}/>
                      <View style={{position:'absolute',width:130,height:130,borderRadius:65,borderWidth:1,borderColor:'rgba(255,255,255,.35)'}}/>
                      <Text style={{color:'#FFFFFF',fontSize:64,fontWeight:'900',textShadowColor:item.b,textShadowRadius:22}}>{item.glyph}</Text>
                      <Text style={{color:'#FFFFFF',fontSize:11,fontWeight:'900',letterSpacing:1.2,marginTop:10}}>{item.name}</Text>
                      <Text style={{color:'#D9E8FF',fontSize:7,marginTop:5}}>ANIMATED STYLE PREVIEW</Text>
                      <View style={{position:'absolute',bottom:8,left:8,right:8,alignItems:'center',paddingVertical:7,borderRadius:10,backgroundColor:'rgba(3,7,18,.76)'}}>
                        <Text style={{color:'#FFFFFF',fontSize:8,fontWeight:'900'}}>▶  USE TEMPLATE</Text>
                      </View>
                    </TouchableOpacity>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',gap:18}}>
                      <TouchableOpacity onPress={()=>setLikedTemplates(v=>v.includes(item.name)?v.filter(x=>x!==item.name):[...v,item.name])} style={{alignItems:'center'}}>
                        <Text style={{color:likedTemplates.includes(item.name)?'#FF6B9D':'#FFFFFF',fontSize:25}}>{likedTemplates.includes(item.name)?'♥':'♡'}</Text>
                        <Text style={{color:'#DCE7FA',fontSize:7,fontWeight:'800'}}>{likedTemplates.includes(item.name)?'LIKED':'LIKE'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>setLastAction('Comments for '+item.name+' — comment service is not connected yet')} style={{alignItems:'center'}}>
                        <Text style={{color:'#FFFFFF',fontSize:23}}>▤</Text>
                        <Text style={{color:'#DCE7FA',fontSize:7,fontWeight:'800'}}>COMMENT</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>setLastAction(item.name+' shared')} style={{alignItems:'center'}}>
                        <Text style={{color:'#FFFFFF',fontSize:22}}>↗</Text>
                        <Text style={{color:'#DCE7FA',fontSize:7,fontWeight:'800'}}>SHARE</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>{setProjectType('video');setProjectName(item.name+' Project');setPage('editor');}} style={{alignItems:'center'}}>
                        <Text style={{color:'#7CEBFF',fontSize:22}}>＋</Text>
                        <Text style={{color:'#DCE7FA',fontSize:7,fontWeight:'800'}}>USE</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{position:'absolute',left:16,bottom:15,maxWidth:195}}>
                      <Text style={{color:'#FFFFFF',fontSize:8,fontWeight:'900'}}>{item.creator}</Text>
                      <Text style={{color:'#C4D4F2',fontSize:7,marginTop:3}}>{item.tag}</Text>
                    </View>
                  </View>
                ))}
                <Text style={{color:'#8999B8',fontSize:8,textAlign:'center',padding:10}}>یہ فیڈ فی الحال نمونہ جاتی اینیمیٹڈ پریویوز دکھاتی ہے۔ حقیقی کریئیٹر ویڈیوز، کمنٹس اور شیئر لنکس کے لیے ویڈیو ہوسٹنگ اور بیک اینڈ کنکشن درکار ہے۔</Text>
              </ScrollView>
            </View>
          )}
          {page==='aimodels'&&(
            <ScrollView contentContainerStyle={s.subContent}>
              <View style={s.hero}><Text style={s.heroTitle}>AI MODEL LIBRARY</Text><Text style={s.heroCopy}>Video, image, frame interpolation, voice and audio model directory.</Text></View>
              {AI_MODELS.map((x,i)=><TouchableOpacity key={x} style={s.projectRow} onPress={()=>setLastAction(x+' selected — API / license connection required')}><View style={{width:36,height:36,borderRadius:12,backgroundColor:'rgba(128,232,243,.12)',alignItems:'center',justifyContent:'center'}}><Text style={{color:C.cyan,fontWeight:'900'}}>AI</Text></View><View style={{flex:1}}><Text style={s.helpTitle}>{x}</Text><Text style={s.smallMuted}>{i<20?'Video / image / interpolation':'Voice / audio / speech'}</Text></View><Text style={s.link}>VIEW</Text></TouchableOpacity>)}
              <Text style={s.statsNote}>These are model/service options, not bundled engines. Each requires provider permission, API credentials, compatible hardware and licensing.</Text>
            </ScrollView>
          )}
          {page==='effects'&&(
            <ScrollView contentContainerStyle={s.subContent}>
              <TextInput value={effectSearch} onChangeText={setEffectSearch} placeholder="Search effects, filters and transitions..." placeholderTextColor={C.muted} style={s.nameInput}/>
              {TOOL_GROUPS.Effects.concat(TOOL_GROUPS.Transitions).filter(x=>x.toLowerCase().includes(effectSearch.toLowerCase())).map(x=><TouchableOpacity key={x} style={s.option} onPress={()=>{setPage('editor');chooseTool(x);}}><Text style={s.optionText}>{x}</Text></TouchableOpacity>)}
              <TouchableOpacity style={s.connectButton} onPress={()=>setLastAction('Effect upload requires approved Creator account and validated effect runtime')}><Text style={s.claimText}>＋ UPLOAD CREATOR EFFECT</Text></TouchableOpacity>
              <Text style={s.statsNote}>Creator-uploaded effect packages need a validated effect runtime before they can execute inside the editor.</Text>
            </ScrollView>
          )}
          {page==='creator'&&(
            <ScrollView contentContainerStyle={s.subContent}>
              <View style={[s.hero,{alignItems:'center'}]}><View style={{width:116,height:116,borderRadius:58,borderWidth:4,borderColor:'#B58AFF',backgroundColor:'#211A35',alignItems:'center',justifyContent:'center',marginBottom:12}}><Text style={{fontSize:38,fontWeight:'900',color:'#F1D28A',letterSpacing:2}}>EP</Text><Text style={{fontSize:10,color:'#F1D28A',letterSpacing:2}}>✦ ✦ ✦</Text></View><Text style={s.heroTitle}>EP CREATOR AWARDS</Text><Text style={s.heroAccent}>LEGENDARY TOP CREATOR</Text><Text style={s.heroCopy}>{creatorId} · {creatorPoints.toLocaleString()} POINTS</Text><Text style={s.proBadge}>✦ {activeRank.name.toUpperCase()} · {activeRank.stars} STARS</Text></View>
              <Text style={s.sectionTitle}>Creator Progress</Text>
              {CREATOR_LEVELS.map(x=><View key={x.level} style={s.projectRow}><View style={{width:54,height:54,borderRadius:27,borderWidth:3,borderColor:['#B77945','#D69A62','#A8B3C2','#C7D5E6','#D9AA36','#F0CB68','#65CFE8','#B58AFF'][x.level-1],backgroundColor:'#211A35',alignItems:'center',justifyContent:'center',marginRight:5}}><Text style={{fontSize:18,fontWeight:'900',color:'#F1D28A'}}>EP</Text><Text style={{fontSize:7,color:'#F1D28A'}}>{'✦'.repeat(Math.min(x.stars,8))}</Text></View><View style={{flex:1}}><Text style={s.helpTitle}>LEVEL {x.level} · {x.name}</Text><Text style={s.smallMuted}>{x.points.toLocaleString()} points · {x.reward} free premium</Text><Text style={s.smallMuted}>{x.frame}</Text></View><Text style={s.link}>{creatorLevel>=x.level?'UNLOCKED':'LOCKED'}</Text></View>)}
              <TouchableOpacity style={s.connectButton} onPress={()=>{setConnectedSocial(true);openSocial(TIKTOK);}}><Text style={s.claimText}>{connectedSocial?'SOCIAL PROFILE OPENED':'CONNECT TIKTOK / INSTAGRAM'}</Text></TouchableOpacity>
              <Text style={s.eyebrow}>SOCIAL FOLLOWERS (VERIFICATION REQUIRED)</Text>              <TextInput value={creatorFollowers} onChangeText={setCreatorFollowers} keyboardType="number-pad" placeholder="Enter verified follower count" placeholderTextColor={C.muted} style={s.nameInput}/>
              <TouchableOpacity style={s.connectButton} onPress={()=>{if(Number(creatorFollowers)>=5000)setCreatorApplied(true);else setCreatorApplied(false);}}><Text style={s.claimText}>{creatorApplied?'APPLICATION SUBMITTED':'APPLY FOR TEMPLATE CREATOR'}</Text></TouchableOpacity>
              <Text style={s.statsNote}>{creatorApplied?'Your application is marked submitted in this local preview. Admin review and social verification are still required.':'You need at least 5,000 followers to apply. Enter a verified count above.'} You can upload templates and effects after approval. Template Creator eligibility target: 5,000+ followers, subject to manual verification. Social APIs may not expose follower counts. Points must be calculated server-side from verified followers, likes, views and genuine template usage. This local owner profile is a UI preview, not secure account authorization.</Text>
            </ScrollView>
          )}

          {page==='membership'&&(
            <ScrollView contentContainerStyle={s.subContent}>
              {[
                ['STANDARD · WEEKLY','Rs. 350','Core editing tools · Standard access'],
                ['PRO · WEEKLY','Rs. 550','Full professional workspace · Pro access'],
                ['STANDARD · MONTHLY','Rs. 1,000','Core editing tools · Standard access'],
                ['PRO · MONTHLY','Rs. 1,500','Full professional workspace · Pro access'],
                ['STANDARD · YEARLY','Rs. 9,000','Core editing tools · Standard access'],
                ['PRO · YEARLY','Rs. 11,499','Full professional workspace · Pro access'],
                ['STANDARD · LIFETIME','Rs. 20,000','Standard access for lifetime']
              ].map(x=>(
                <View key={x[0]} style={s.plan}>
                  <Text style={s.eyebrow}>{x[0]}</Text>
                  <Text style={s.planPrice}>{x[1]}</Text>
                  <Text style={s.smallMuted}>{x[2]}</Text>
                  <Text style={s.link}>PAYMENT GATEWAY REQUIRED</Text>
                </View>
              ))}
            </ScrollView>
          )}

          {page==='help'&&(
            <View style={s.subContent}>
              <View style={s.emptyCard}>
                <EPLogo size={65}/>
                <Text style={s.emptyTitle}>ERROR PIXEL HELP CENTER</Text>
                <Text style={s.smallMuted}>Choose AI Help to ask a question. Help articles can be added here.</Text>
                <TouchableOpacity style={s.connectButton} onPress={()=>setModal('aihelp')}>
                  <Text style={s.claimText}>OPEN AI HELP</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      <Modal visible={shortcutPanel} transparent animationType="fade"
        onRequestClose={()=>setShortcutPanel(false)}>
        <View style={s.modalCenter}>
          <View style={s.dialog}>
            <View style={s.dialogHead}>
              <Text style={s.dialogTitle}>KEYBOARD SHORTCUTS</Text>
              <RoundButton onPress={()=>setShortcutPanel(false)}>
                <Text style={s.buttonGlyph}>×</Text>
              </RoundButton>
            </View>
            <ScrollView style={{maxHeight:450}}>
              {[
                ['Ctrl + C','Copy clip'],['Ctrl + V','Paste clip'],
                ['Ctrl + X','Cut clip'],['Ctrl + Z','Undo'],
                ['Ctrl + Y','Redo'],['Ctrl + D','Duplicate clip'],
                ['Ctrl + A','Select all clips'],['Ctrl + S','Save action'],
                ['Space','Play / Pause'],['Delete','Delete clip'],
                ...Object.entries(SHORTCUTS).map(([key,name])=>[key.toUpperCase(),name+' Tool']),
                ['Esc','Close / Cancel']
              ].map((x,i)=>(
                <View key={i} style={s.shortcutRow}>
                  <Text style={s.shortcutKey}>{x[0]}</Text>
                  <Text style={s.optionText}>{x[1]}</Text>
                </View>
              ))}
            </ScrollView>
            <Text style={s.statsNote}>
              Shortcuts work in the web editor when you are not typing inside a text field.
            </Text>
          </View>
        </View>
      </Modal>

      <Modal visible={drawer} transparent animationType="fade" onRequestClose={()=>setDrawer(false)}>
        <View style={s.modalBackdrop}>
          <TouchableOpacity style={{flex:1}} onPress={()=>setDrawer(false)}/>
          <View style={s.drawer}>
            <View style={s.drawerHead}>
              <EPLogo size={64}/>
              <View>
                <Text style={s.brand}>ERROR PIXEL</Text>
                <Text style={s.brandSub}>PRO CREATIVE STUDIO</Text>
              </View>
            </View>
            {menu.map(x=>(
              <TouchableOpacity key={x[1]} style={s.drawerItem} onPress={()=>{
                setDrawer(false);setPage(x[1]);
              }}>
                <Text style={s.optionText}>{x[0]}</Text>
                <Text style={s.link}>↗</Text>
              </TouchableOpacity>
            ))}
            <Text style={s.powered}>POWERED BY MUNEEB HASSAN</Text>
          </View>
        </View>
      </Modal>

      <Modal visible={!!modal} transparent animationType="fade" onRequestClose={()=>setModal('')}>
        <View style={s.modalCenter}>
          <View style={s.dialog}>
            <View style={s.dialogHead}>
              <EPLogo size={43}/>
              <View style={{flex:1}}>
                <Text style={s.dialogTitle}>
                  {modal==='export'?'EXPORT SETTINGS':modal==='aihelp'?'ERROR PIXEL AI HELP':modal==='import'?'IMPORT MEDIA':'HELP CENTER'}
                </Text>
                <Text style={s.brandSub}>ERROR PIXEL STUDIO</Text>
              </View>
              <RoundButton onPress={()=>setModal('')}>
                <Text style={s.buttonGlyph}>×</Text>
              </RoundButton>
            </View>

            {modal==='import'&&(
              <View>
                <Text style={s.body}>Choose the type of media you want to add. Android will ask for photo and video access when needed.</Text>
                {[['Choose video','video'],['Choose image','image'],['Choose audio','audio']].map(([label,type])=>(
                  <TouchableOpacity key={type} style={s.connectButton} onPress={()=>importMedia(type)}>
                    <Text style={s.claimText}>{label.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
                <Text style={s.statsNote}>Your selected files will appear in Media Library. Folder import is not available yet.</Text>
              </View>
            )}

            {modal==='export'&&(
              <ScrollView style={{maxHeight:420}}>
                <Text style={s.eyebrow}>PROJECT NAME</Text>
                <TextInput value={projectName} onChangeText={setProjectName}
                  placeholder="Project name" placeholderTextColor={C.muted}
                  style={s.nameInput}/>
                <Text style={s.eyebrow}>RESOLUTION</Text>
                <View style={s.choiceRow}>
                  {RESOLUTIONS.map(x=>(
                    <TouchableOpacity key={x} onPress={()=>setResolution(x)}
                      style={[s.choice,resolution===x&&s.choiceActive]}>
                      <Text style={s.optionText}>{x}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[s.eyebrow,{marginTop:15}]}>FRAME RATE</Text>
                <View style={s.choiceGrid}>
                  {FRAME_RATES.map(x=>(
                    <TouchableOpacity key={x} onPress={()=>setFps(x)}
                      style={[s.choice,s.choiceHalf,fps===x&&s.choiceActive]}>
                      <Text style={s.optionText}>{x}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[s.eyebrow,{marginTop:15}]}>OUTPUT FORMAT</Text>
                <View style={s.choiceRow}>{FORMATS.map(x=><TouchableOpacity key={x} onPress={()=>setExportFormat(x)} style={[s.choice,exportFormat===x&&s.choiceActive]}><Text style={s.optionText}>{x}</Text></TouchableOpacity>)}</View>
                <Text style={s.eyebrow}>SLOW MOTION FRAME GENERATION</Text>
                <View style={s.option}>
                  <Text style={s.optionText}>Frame Blending · Optical Flow · AI Frame Generation</Text>
                </View>
                <Text style={s.statsNote}>
                  These are export settings only. Actual rendering, frame interpolation, AI models, codec support and very high FPS require a compatible processing engine and encoder. Selecting 480–10000 FPS does not guarantee the output can be rendered at that rate.
                </Text>
                <TouchableOpacity style={s.connectButton} onPress={()=>{
                  setLastAction('Export settings saved: '+resolution+' · '+fps+' · '+exportFormat);
                  saveProject();
                  setModal('');
                }}>
                  <Text style={s.claimText}>SAVE PROJECT SETTINGS</Text>
                </TouchableOpacity>
              </ScrollView>
            )}

            {modal==='aihelp'&&(
              <View>
                <Text style={s.body}>AI Help requires a secure AI service connection before it can answer questions.</Text>
                <TextInput value={helpQuestion} onChangeText={setHelpQuestion}
                  placeholder="Type your editing question..."
                  placeholderTextColor={C.muted} style={s.nameInput}/>
                <TouchableOpacity style={s.connectButton} onPress={()=>{
                  setLastAction('AI service connection required for: '+helpQuestion);
                  setModal('');
                }}>
                  <Text style={s.claimText}>SUBMIT QUESTION</Text>
                </TouchableOpacity>
              </View>
            )}

            {modal==='help'&&(
              <View>
                <Text style={s.body}>Select a tool in the editor to view its available options. Export settings can be opened from the top-right Export button.</Text>
                <TouchableOpacity style={s.connectButton} onPress={()=>setModal('aihelp')}>
                  <Text style={s.claimText}>OPEN AI HELP</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg},
  main:{flex:1,backgroundColor:C.bg},
  welcome:{flex:1,alignItems:'center',justifyContent:'center',padding:28,backgroundColor:C.bg},
  ambient:{position:'absolute',width:340,height:340,borderRadius:170,backgroundColor:'rgba(93,125,255,.13)',borderWidth:1,borderColor:'rgba(114,232,255,.16)',shadowColor:'#72E8FF',shadowOpacity:.55,shadowRadius:65,elevation:18},
  logo:{alignItems:'center',justifyContent:'center',backgroundColor:'#111B32',borderWidth:2,borderColor:'rgba(125,224,255,.82)',shadowColor:C.cyan,shadowOpacity:.72,shadowRadius:22,elevation:16,overflow:'hidden'},
  logoRing:{position:'absolute',borderWidth:2,borderColor:'rgba(128,232,243,.8)',borderTopColor:C.pink},
  logoRing2:{position:'absolute',borderWidth:1.5,borderColor:'rgba(227,169,242,.7)',borderLeftColor:C.gold},
  logoGlint:{position:'absolute',height:3,borderRadius:4,top:'22%',right:'18%',backgroundColor:C.cyan,transform:[{rotate:'-35deg'}]},
  welcomeBrand:{color:C.white,fontSize:31,fontWeight:'900',letterSpacing:2,marginTop:28},
  tag:{color:C.cyan,fontSize:8,letterSpacing:2.4,marginTop:10},
  loadingLine:{flexDirection:'row',alignItems:'center',gap:9,marginTop:42},
  loadingText:{color:C.cyan,fontSize:8,letterSpacing:1.4},
  powered:{color:C.muted,fontSize:8,letterSpacing:1.5,marginTop:24},
  channel:{color:C.violet,fontSize:10,fontWeight:'900',letterSpacing:2,marginTop:8},
  homeContent:{padding:15,paddingBottom:72},
  dashHero:{minHeight:286,padding:17,borderRadius:27,overflow:'hidden',backgroundColor:'#101A35',borderWidth:1,borderTopColor:'rgba(255,255,255,.72)',borderLeftColor:'rgba(174,133,255,.8)',borderRightColor:'rgba(89,226,255,.9)',borderBottomColor:'rgba(76,93,159,.9)',shadowColor:'#56DFFF',shadowOpacity:.28,shadowRadius:24,elevation:13},
  heroOrbOne:{position:'absolute',width:230,height:230,borderRadius:115,right:-70,top:35,backgroundColor:'rgba(105,91,255,.20)',borderWidth:1,borderColor:'rgba(150,139,255,.18)'},
  heroOrbTwo:{position:'absolute',width:150,height:150,borderRadius:75,right:10,top:70,backgroundColor:'rgba(71,207,255,.10)',borderWidth:1,borderColor:'rgba(114,232,255,.25)'},
  dashHeroTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  liveChip:{flexDirection:'row',alignItems:'center',gap:7,paddingHorizontal:10,paddingVertical:7,borderRadius:20,backgroundColor:'rgba(74,220,203,.10)',borderWidth:1,borderColor:'rgba(102,237,220,.35)'},
  liveDot:{width:6,height:6,borderRadius:3,backgroundColor:'#70F2D5'},
  liveChipText:{color:'#9DF5E5',fontSize:7,fontWeight:'900',letterSpacing:1},
  heroEdition:{color:'#AEBBE0',fontSize:7,fontWeight:'800',letterSpacing:1.2},
  dashHeroMain:{flexDirection:'row',alignItems:'center',paddingTop:24,paddingBottom:19},
  dashKicker:{color:C.cyan,fontSize:8,fontWeight:'900',letterSpacing:2},
  dashHeadline:{color:'#FFFFFF',fontSize:34,fontWeight:'900',letterSpacing:-1.5,marginTop:10},
  dashHeadlineAccent:{color:'#B7A2FF',fontSize:23,fontWeight:'900',letterSpacing:.2,marginTop:-2},
  dashDescription:{color:'#B5C3E2',fontSize:9,lineHeight:15,marginTop:10,maxWidth:210},
  dashPrimary:{height:39,alignSelf:'flex-start',flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:14,marginTop:17,borderRadius:22,backgroundColor:'rgba(111,220,255,.17)',borderWidth:1,borderTopColor:'rgba(255,255,255,.85)',borderLeftColor:'#B89AFF',borderRightColor:'#70E8FF',borderBottomColor:'rgba(100,140,220,.7)',shadowColor:C.cyan,shadowOpacity:.42,shadowRadius:13,elevation:8},
  dashPrimaryText:{color:'#F7FCFF',fontSize:8,fontWeight:'900',letterSpacing:.8},
  dashPrimaryArrow:{color:C.cyan,fontSize:16,fontWeight:'900'},
  heroEmblem:{width:112,alignItems:'center',marginLeft:3},
  heroEmblemRing:{width:105,height:105,borderRadius:53,alignItems:'center',justifyContent:'center',borderWidth:1.5,borderColor:'rgba(113,232,255,.55)',backgroundColor:'rgba(117,105,255,.13)',shadowColor:'#9D8AFF',shadowOpacity:.65,shadowRadius:20,elevation:12},
  emblemCaption:{color:'#AABDE5',fontSize:6,fontWeight:'900',letterSpacing:2,marginTop:9},
  heroBottomLine:{paddingTop:11,borderTopWidth:1,borderTopColor:'rgba(176,201,255,.18)',flexDirection:'row',justifyContent:'space-between'},
  heroBottomText:{color:'#94A8D0',fontSize:6,fontWeight:'800',letterSpacing:.8},
  dashSectionHead:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',marginTop:25,marginBottom:12},
  dashIndex:{color:'#7889B4',fontSize:7,fontWeight:'900',letterSpacing:1},
  dashStudioGrid:{flexDirection:'row',gap:10,minHeight:208},
  dashVideoStudio:{flex:1.08,padding:13,borderRadius:20,backgroundColor:'#111D3A',borderWidth:1,borderTopColor:'rgba(255,255,255,.58)',borderLeftColor:'rgba(173,137,255,.65)',borderRightColor:'rgba(114,232,255,.72)',borderBottomColor:'rgba(83,103,170,.65)',justifyContent:'space-between',shadowColor:'#72E8FF',shadowOpacity:.18,shadowRadius:15,elevation:7},
  dashStudioSide:{flex:1,gap:10},
  dashPhotoStudio:{flex:1,padding:11,borderRadius:18,backgroundColor:'#171B3A',borderWidth:1,borderColor:'rgba(177,151,255,.55)',justifyContent:'space-between'},
  dashAIStudio:{flex:1,padding:11,borderRadius:18,backgroundColor:'#10263A',borderWidth:1,borderColor:'rgba(114,232,255,.55)',justifyContent:'space-between'},
  studioTopline:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  studioTag:{color:'#A9B9DE',fontSize:6,fontWeight:'900',letterSpacing:1},
  studioArrow:{color:C.cyan,fontSize:17,fontWeight:'900'},
  studioGraphic:{height:95,alignItems:'center',justifyContent:'center',borderRadius:15,backgroundColor:'rgba(102,126,220,.10)',borderWidth:1,borderColor:'rgba(124,205,255,.2)',overflow:'hidden'},
  studioPlay:{width:48,height:48,borderRadius:24,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(105,221,255,.18)',borderWidth:1.5,borderColor:'rgba(133,235,255,.8)',shadowColor:C.cyan,shadowOpacity:.7,shadowRadius:13,elevation:7},
  studioPlayGlyph:{color:'#FFFFFF',fontSize:18,marginLeft:3},
  studioWave:{position:'absolute',height:2,width:'80%',bottom:17,backgroundColor:'rgba(126,218,255,.55)'},
  studioTitle:{color:'#FFFFFF',fontSize:14,fontWeight:'900',letterSpacing:.5,marginTop:8},
  studioSub:{color:C.cyan,fontSize:6,fontWeight:'800',letterSpacing:.6,marginTop:4},
  sideStudioGlyph:{color:'#C0A7FF',fontSize:27,fontWeight:'900'},
  sideStudioTitle:{color:'#FFFFFF',fontSize:9,fontWeight:'900',letterSpacing:.5},
  dashMetricsRow:{flexDirection:'row',gap:8,marginTop:12},
  dashMetric:{flex:1,minWidth:0,padding:11,borderRadius:15,backgroundColor:'rgba(19,29,55,.92)',borderWidth:1,borderTopColor:'rgba(255,255,255,.32)',borderLeftColor:'rgba(165,140,255,.35)',borderRightColor:'rgba(114,232,255,.38)',borderBottomColor:'rgba(79,100,158,.55)'},
  dashMetricIcon:{color:C.cyan,fontSize:13},
  dashMetricValue:{color:'#FFFFFF',fontSize:20,fontWeight:'900',marginTop:7},
  dashMetricValueSmall:{color:'#FFFFFF',fontSize:12,fontWeight:'900',marginTop:11},
  dashMetricLabel:{color:'#91A3C8',fontSize:6,fontWeight:'900',letterSpacing:.8,marginTop:5},
  creatorBanner:{flexDirection:'row',alignItems:'center',gap:12,padding:14,marginTop:24,borderRadius:18,backgroundColor:'rgba(102,81,176,.16)',borderWidth:1,borderTopColor:'rgba(255,255,255,.42)',borderLeftColor:'rgba(181,146,255,.65)',borderRightColor:'rgba(114,232,255,.48)',borderBottomColor:'rgba(102,86,168,.6)'},
  creatorBannerIcon:{width:39,height:39,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(181,146,255,.18)',borderWidth:1,borderColor:'rgba(193,169,255,.55)'},
  creatorBannerGlyph:{color:'#D2C1FF',fontSize:20},
  creatorBannerKicker:{color:C.cyan,fontSize:6,fontWeight:'900',letterSpacing:1},
  creatorBannerTitle:{color:'#FFFFFF',fontSize:13,fontWeight:'900',marginTop:4},
  creatorBannerSub:{color:'#AAB9D8',fontSize:7,marginTop:4},
  creatorBannerArrow:{color:C.cyan,fontSize:22,fontWeight:'900'},
  quickTool:{width:'30%',minHeight:82,alignItems:'center',justifyContent:'center',paddingVertical:13,borderRadius:17,backgroundColor:'rgba(21,31,58,.94)',borderWidth:1,borderTopColor:'rgba(255,255,255,.32)',borderLeftColor:'rgba(167,139,250,.38)',borderRightColor:'rgba(114,232,255,.42)',borderBottomColor:'rgba(83,103,170,.55)',shadowColor:'#7E8BFF',shadowOpacity:.13,shadowRadius:10,elevation:5},
  quickIcon:{color:C.cyan,fontSize:22},
  quickLabel:{color:'#E8F0FF',fontSize:6.5,fontWeight:'900',letterSpacing:.3,marginTop:8,textAlign:'center',paddingHorizontal:3},

  dashboardMetrics:{flexDirection:'row',gap:9,marginTop:18},
  metricCard:{flex:1,minWidth:0,minHeight:108,padding:12,borderRadius:17,backgroundColor:'rgba(20,31,55,.94)',borderWidth:1,borderTopColor:'rgba(235,248,255,.42)',borderLeftColor:'rgba(167,139,250,.46)',borderRightColor:'rgba(114,232,255,.48)',borderBottomColor:'rgba(86,116,184,.55)',shadowColor:'#72E8FF',shadowOpacity:.16,shadowRadius:12,elevation:6},
  metricIcon:{color:C.cyan,fontSize:16,fontWeight:'900'},
  metricValue:{color:C.white,fontSize:17,fontWeight:'900',marginTop:10},
  metricLabel:{color:C.muted,fontSize:7,fontWeight:'800',letterSpacing:.8,marginTop:5},
  dashboardStatus:{flexDirection:'row',alignItems:'center',gap:12,padding:15,marginTop:10,borderRadius:17,backgroundColor:'rgba(16,32,43,.94)',borderWidth:1,borderTopColor:'rgba(225,255,249,.34)',borderLeftColor:'rgba(114,232,255,.30)',borderRightColor:'rgba(101,214,176,.42)',borderBottomColor:'rgba(60,123,125,.5)',shadowColor:'#65D6B0',shadowOpacity:.14,shadowRadius:12,elevation:5},
  dashboardStatusTitle:{color:C.white,fontSize:13,fontWeight:'800',marginTop:6},
  statusPill:{paddingHorizontal:11,paddingVertical:7,borderRadius:20,backgroundColor:'rgba(101,200,169,.13)',borderWidth:1,borderColor:'rgba(101,200,169,.4)'},
  statusPillText:{color:C.green,fontSize:8,fontWeight:'900',letterSpacing:1},
  topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:20,padding:11,borderRadius:19,backgroundColor:'rgba(17,25,47,.88)',borderWidth:1,borderTopColor:'rgba(255,255,255,.25)',borderLeftColor:'rgba(167,139,250,.28)',borderRightColor:'rgba(114,232,255,.34)',borderBottomColor:'rgba(91,110,169,.38)'},
  topActions:{flexDirection:'row',gap:8},
  brandRow:{flexDirection:'row',alignItems:'center',gap:10},
  brand:{color:C.white,fontSize:16,fontWeight:'900',letterSpacing:1.2},
  brandSub:{color:C.cyan,fontSize:6,letterSpacing:1.4,marginTop:4},
  roundButton:{width:42,height:42,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(53,69,120,.52)',borderWidth:1.3,borderTopColor:'rgba(255,255,255,.86)',borderLeftColor:'rgba(173,143,255,.76)',borderRightColor:'rgba(103,232,255,.86)',borderBottomColor:'rgba(78,91,160,.92)',shadowColor:C.cyan,shadowOpacity:.38,shadowRadius:13,elevation:9},
  roundActive:{backgroundColor:'rgba(128,232,243,.15)',borderColor:C.cyan},
  buttonGlyph:{color:C.white,fontSize:17,fontWeight:'800'},
  notification:{flexDirection:'row',alignItems:'center',gap:10,padding:12,marginBottom:10,borderRadius:15,backgroundColor:'rgba(128,232,243,.07)',borderWidth:1,borderColor:'rgba(128,232,243,.27)'},
  notificationGlyph:{color:C.cyan,fontSize:19},
  notificationHead:{color:C.cyan,fontSize:7,fontWeight:'900',letterSpacing:1.2},
  notificationText:{color:C.white,fontSize:9,marginTop:4},
  eyebrow:{color:C.cyan,fontSize:7,letterSpacing:1.4,fontWeight:'800'},
  smallMuted:{color:C.muted,fontSize:8,marginTop:5},
  claimText:{color:'#fff',fontSize:9,fontWeight:'900',letterSpacing:1},
  claimHint:{color:C.muted,fontSize:6,marginTop:6},
  welcomeText:{marginBottom:16},
  heading:{color:C.white,fontSize:25,fontWeight:'900',marginTop:5},
  body:{color:C.muted,fontSize:10,marginTop:8,lineHeight:17},
  hero:{padding:18,borderRadius:22,backgroundColor:'rgba(19,26,48,.96)',borderWidth:1,borderTopColor:'rgba(255,255,255,.44)',borderLeftColor:'rgba(167,139,250,.48)',borderRightColor:'rgba(114,232,255,.52)',borderBottomColor:'rgba(89,108,174,.62)',shadowColor:'#8D79F5',shadowOpacity:.24,shadowRadius:20,elevation:9},
  heroTop:{flexDirection:'row',justifyContent:'space-between'},
  proBadge:{color:C.gold,fontSize:7,borderWidth:1,borderColor:'rgba(233,211,159,.4)',borderRadius:20,padding:7,overflow:'hidden'},
  heroCenter:{alignItems:'center',paddingVertical:22,borderRadius:18,backgroundColor:'rgba(89,111,180,.07)',borderWidth:1,borderColor:'rgba(166,203,255,.12)'},
  heroTitle:{color:C.white,fontSize:22,fontWeight:'900',letterSpacing:1.5,marginTop:12},
  heroAccent:{color:C.violet,fontSize:24,fontWeight:'900',letterSpacing:2},
  heroCopy:{color:C.muted,fontSize:9,textAlign:'center',lineHeight:15,maxWidth:250,marginTop:9},
  newProject:{flexDirection:'row',alignItems:'center',padding:11,borderRadius:30,backgroundColor:'rgba(114,232,255,.09)',borderWidth:1,borderTopColor:'rgba(255,255,255,.42)',borderLeftColor:'rgba(167,139,250,.4)',borderRightColor:'rgba(114,232,255,.58)',borderBottomColor:'rgba(82,105,170,.5)',shadowColor:C.cyan,shadowOpacity:.16,shadowRadius:10,elevation:5},
  newProjectTitle:{color:C.white,fontSize:9,fontWeight:'900',letterSpacing:.8},
  arrow:{color:C.cyan,fontSize:20},
  sectionRow:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',marginTop:25,marginBottom:12},
  sectionTitle:{color:C.white,fontSize:18,fontWeight:'900',marginTop:5},
  counter:{color:C.muted,fontSize:8},
  workspaceGrid:{flexDirection:'row',gap:9},
  videoCard:{width:'49%',minHeight:178,padding:15,borderRadius:19,justifyContent:'space-between',backgroundColor:'rgba(20,30,56,.96)',borderWidth:1,borderTopColor:'rgba(255,255,255,.42)',borderLeftColor:'rgba(167,139,250,.48)',borderRightColor:'rgba(114,232,255,.50)',borderBottomColor:'rgba(83,103,170,.62)',shadowColor:'#72E8FF',shadowOpacity:.20,shadowRadius:14,elevation:7},
  cardIcon:{color:C.violet,fontSize:28},
  cardTitle:{color:C.white,fontSize:18,fontWeight:'900'},
  cardSub:{color:C.cyan,fontSize:6,letterSpacing:1,marginTop:7},
  cardArrow:{color:C.white,fontSize:20,position:'absolute',right:13,bottom:12},
  sideCards:{flex:1,gap:9},
  smallCard:{flex:1,padding:13,borderRadius:17,justifyContent:'center',backgroundColor:'rgba(22,29,53,.96)',borderWidth:1,borderTopColor:'rgba(255,255,255,.36)',borderLeftColor:'rgba(167,139,250,.38)',borderRightColor:'rgba(114,232,255,.42)',borderBottomColor:'rgba(83,103,170,.55)',shadowColor:'#9C7BFF',shadowOpacity:.16,shadowRadius:11,elevation:6},
  smallCardTitle:{color:C.white,fontSize:9,fontWeight:'900',marginTop:7},
  link:{color:C.cyan,fontSize:8,fontWeight:'900',letterSpacing:.7},
  previewGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:10},
  previewCard:{width:'48%',padding:10,borderRadius:20,backgroundColor:'rgba(29,39,75,.78)',borderWidth:1.3,borderTopColor:'rgba(255,255,255,.78)',borderLeftColor:'rgba(167,139,250,.72)',borderRightColor:'rgba(114,232,255,.78)',borderBottomColor:'rgba(83,103,170,.82)',shadowColor:C.violet,shadowOpacity:.28,shadowRadius:16,elevation:9},
  previewVisual:{height:91,borderRadius:14,backgroundColor:'rgba(63,63,115,.36)',borderWidth:1.2,borderTopColor:'rgba(255,255,255,.75)',borderLeftColor:'rgba(170,139,255,.68)',borderRightColor:'rgba(104,230,255,.78)',borderBottomColor:'rgba(83,88,157,.86)',alignItems:'center',justifyContent:'center',shadowColor:'#7B79FF',shadowOpacity:.25,shadowRadius:12,elevation:6},
  previewIcon:{fontSize:35,fontWeight:'900'},
  previewPlay:{color:C.cyan,fontSize:6,letterSpacing:1,marginTop:6},
  previewName:{color:C.white,fontSize:9,fontWeight:'900',marginTop:9},
  previewSub:{color:C.muted,fontSize:7,marginTop:4},
  quickGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:10},
  quickTool:{width:'30%',alignItems:'center',paddingVertical:14,borderRadius:16,backgroundColor:C.panel,borderWidth:1,borderColor:C.line},
  quickIcon:{color:C.cyan,fontSize:22},
  quickLabel:{color:C.white,fontSize:7,fontWeight:'800',marginTop:7},
  helpRow:{flexDirection:'row',gap:10},
  helpCard:{flex:1,padding:15,borderRadius:16,backgroundColor:C.panel,borderWidth:1,borderColor:C.line},
  helpIcon:{color:C.cyan,fontSize:25},
  helpTitle:{color:C.white,fontSize:9,fontWeight:'900',marginTop:8},
  emptyCard:{alignItems:'center',padding:22,borderRadius:19,backgroundColor:C.panel,borderWidth:1,borderColor:C.line},
  emptyTitle:{color:C.white,fontSize:11,fontWeight:'800',marginTop:12},
  projectRow:{flexDirection:'row',alignItems:'center',gap:12,padding:14,marginBottom:10,borderRadius:17,backgroundColor:'rgba(20,28,51,.95)',borderWidth:1,borderTopColor:'rgba(255,255,255,.32)',borderLeftColor:'rgba(167,139,250,.34)',borderRightColor:'rgba(114,232,255,.40)',borderBottomColor:'rgba(83,103,170,.48)'},
  tiktokStats:{marginTop:25,padding:15,borderRadius:18,backgroundColor:'#151321',borderWidth:1,borderColor:'rgba(128,232,243,.35)'},
  tiktokHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  tiktokTitle:{color:C.white,fontSize:15,fontWeight:'900',marginTop:5},
  tiktokLogo:{color:C.cyan,fontSize:29,fontWeight:'900'},
  statsGrid:{flexDirection:'row',gap:7,marginTop:14},
  statBox:{flex:1,paddingVertical:13,alignItems:'center',borderRadius:11,backgroundColor:'rgba(255,255,255,.045)'},
  statNumber:{color:C.white,fontSize:19,fontWeight:'900'},
  statLabel:{color:C.muted,fontSize:6,fontWeight:'800',marginTop:5},
  statsNote:{color:C.muted,fontSize:8,lineHeight:14,marginTop:11},
  connectButton:{height:40,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:'#7254B4',marginTop:13,borderWidth:1,borderColor:'#BDA5FF'},
  footer:{alignItems:'center',paddingVertical:27},
  socialDock:{position:'absolute',right:7,top:'34%',alignItems:'center',gap:10,padding:7,borderRadius:28,backgroundColor:'rgba(18,14,31,.95)',borderWidth:1,borderColor:'rgba(200,180,255,.45)',elevation:12},
  socialButton:{width:42,height:42,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(169,139,255,.18)',borderWidth:1,borderColor:'rgba(220,205,255,.65)'},
  socialIcon:{fontSize:21,fontWeight:'900'},
  subHeader:{height:58,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:14,borderBottomWidth:1,borderColor:C.line},
  subTitle:{color:C.white,fontSize:11,fontWeight:'900',letterSpacing:1.4},
  subContent:{padding:17},
  photoCanvas:{height:240,alignItems:'center',justifyContent:'center',gap:10,borderRadius:18,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,marginBottom:16},
  option:{paddingHorizontal:13,paddingVertical:9,borderRadius:13,marginRight:7,marginBottom:7,backgroundColor:'rgba(47,57,99,.72)',borderWidth:1.2,borderTopColor:'rgba(255,255,255,.82)',borderLeftColor:'rgba(177,147,255,.75)',borderRightColor:'rgba(99,230,255,.78)',borderBottomColor:'rgba(73,82,150,.95)',shadowColor:'#67DFFF',shadowOpacity:.22,shadowRadius:9,elevation:5},
  optionText:{color:C.white,fontSize:8,fontWeight:'800'},
  plan:{padding:18,borderRadius:19,backgroundColor:'rgba(20,28,51,.96)',borderWidth:1,borderTopColor:'rgba(255,255,255,.34)',borderLeftColor:'rgba(167,139,250,.38)',borderRightColor:'rgba(114,232,255,.44)',borderBottomColor:'rgba(83,103,170,.52)',marginBottom:12,shadowColor:C.violet,shadowOpacity:.13,shadowRadius:12,elevation:5},
  planPrice:{color:C.white,fontSize:25,fontWeight:'900',marginVertical:9},
  editorTop:{minHeight:55,flexDirection:'row',alignItems:'center',gap:6,paddingHorizontal:8,borderBottomWidth:1,borderColor:C.line},
  projectName:{color:C.white,fontSize:14,fontWeight:'900',marginTop:3},
  exportTop:{height:37,paddingHorizontal:12,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:'#7655C2',borderWidth:1,borderColor:'#C7B0FF'},
  shortcutTop:{height:35,paddingHorizontal:9,borderRadius:18,alignItems:'center',justifyContent:'center',backgroundColor:C.panel2,borderWidth:1,borderColor:C.line},
  exportTopText:{color:'#fff',fontSize:8,fontWeight:'900'},
  mobileEditor:{flex:1,paddingBottom:164},
  preview:{margin:9,padding:8,borderRadius:15,backgroundColor:'#0E0C18',borderWidth:1,borderColor:C.line},
  previewMeta:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  previewCanvas:{height:130,width:'82%',alignSelf:'center',alignItems:'center',justifyContent:'center',marginVertical:5,borderRadius:8,backgroundColor:'#1A1530',borderWidth:1,borderColor:'rgba(169,139,255,.5)'},
  previewBrand:{color:C.white,fontSize:11,fontWeight:'900',letterSpacing:2,marginTop:4},
  previewControls:{marginTop:3,paddingTop:5,borderTopWidth:1,borderColor:C.line},
  previewTime:{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:5,marginBottom:5},
  controlButtons:{flexDirection:'row',justifyContent:'space-around',alignItems:'center'},
  previewControl:{minWidth:55,alignItems:'center',justifyContent:'center',paddingHorizontal:7,paddingVertical:5,borderRadius:9,backgroundColor:'rgba(169,139,255,.12)',borderWidth:1,borderColor:C.line},
  playControl:{backgroundColor:'rgba(128,232,243,.14)',borderColor:C.cyan},
  keyframeOn:{backgroundColor:'rgba(233,211,159,.16)',borderColor:C.gold},
  controlGlyph:{color:C.white,fontSize:17,fontWeight:'900'},
  controlLabel:{color:C.muted,fontSize:6,fontWeight:'900',marginTop:2},
  timelineBox:{marginHorizontal:8,marginBottom:4,position:'relative'},
  playheadOverlay:{position:'absolute',left:'50%',top:35,bottom:4,width:1,zIndex:8,alignItems:'center'},
  playheadLine:{position:'absolute',top:0,bottom:0,width:2,backgroundColor:'#78EAF5',shadowColor:'#78EAF5',shadowOpacity:.9,shadowRadius:7,elevation:7},
  playheadCap:{position:'absolute',top:-4,width:11,height:11,backgroundColor:'#78EAF5',borderRadius:2,transform:[{rotate:'45deg'}]},
  playheadLabel:{position:'absolute',top:9,left:7,width:105,color:'#8DECF5',fontSize:6,fontWeight:'900',letterSpacing:.5,backgroundColor:'rgba(8,7,17,.82)',padding:3},
  playheadSideLeft:{position:'absolute',top:0,bottom:0,left:-95,width:1,backgroundColor:'rgba(128,232,243,.16)'},
  playheadSideRight:{position:'absolute',top:0,bottom:0,left:95,width:1,backgroundColor:'rgba(128,232,243,.16)'},
  timelineHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginHorizontal:3,marginTop:4,marginBottom:5},
  rulerInner:{width:620,flexDirection:'row',justifyContent:'space-between',paddingLeft:92,paddingRight:10,paddingVertical:7,borderBottomWidth:1,borderColor:C.line},
  rulerText:{color:C.muted,fontSize:8},
  track:{height:30,flexDirection:'row',alignItems:'center',marginBottom:3,borderRadius:7,backgroundColor:'rgba(255,255,255,.035)',borderWidth:1,borderColor:'rgba(255,255,255,.07)',overflow:'hidden'},
  trackName:{width:85,color:C.white,fontSize:7,fontWeight:'900',paddingHorizontal:8},
  trackLane:{flex:1,justifyContent:'center',paddingHorizontal:6},
  clip:{height:21,borderRadius:6,justifyContent:'center',paddingHorizontal:7},
  clipText:{color:'#fff',fontSize:6,fontWeight:'900'},
  toolPanel:{marginHorizontal:8,marginTop:5,padding:10,borderRadius:16,backgroundColor:'rgba(20,29,58,.88)',borderWidth:1.3,borderTopColor:'rgba(255,255,255,.82)',borderLeftColor:'rgba(171,139,255,.78)',borderRightColor:'rgba(90,229,255,.82)',borderBottomColor:'rgba(78,91,166,.92)',shadowColor:'#8B76FF',shadowOpacity:.32,shadowRadius:16,elevation:10},
  toolPanelHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:7,gap:8},
  toolTitle:{color:C.white,fontSize:11,fontWeight:'900',marginTop:3},
  toolDock:{position:'absolute',left:0,right:0,bottom:0,paddingTop:7,paddingBottom:8,backgroundColor:'#100F1D',borderTopWidth:1,borderTopColor:'rgba(219,207,255,.55)',borderBottomColor:'rgba(70,205,231,.45)',elevation:22,zIndex:20,shadowColor:'#8E79E8',shadowOpacity:.32,shadowRadius:14},
  mobileOptionList:{alignItems:'center',paddingHorizontal:7,paddingTop:6,gap:6},
  mobileOption:{paddingHorizontal:12,paddingVertical:8,borderRadius:12,backgroundColor:'rgba(48,59,105,.76)',borderWidth:1.2,borderTopColor:'rgba(255,255,255,.82)',borderLeftColor:'rgba(181,148,255,.76)',borderRightColor:'rgba(103,232,255,.82)',borderBottomColor:'rgba(76,83,153,.96)',shadowColor:'#68DEFF',shadowOpacity:.24,shadowRadius:9,elevation:5},
  mobileOptionText:{color:'#DCD8F2',fontSize:8,fontWeight:'800'},
  turboPanel:{paddingHorizontal:9,paddingVertical:7,marginBottom:5,borderRadius:10,backgroundColor:'#17152A',borderWidth:1,borderTopColor:'rgba(255,255,255,.4)',borderLeftColor:'rgba(178,153,255,.48)',borderRightColor:'rgba(107,219,239,.42)',borderBottomColor:'rgba(76,60,125,.9)'},
  turboTop:{flexDirection:'row',alignItems:'center',gap:7},
  turboLamp:{width:7,height:7,borderRadius:4,backgroundColor:'#78EAF5',shadowColor:'#78EAF5',shadowOpacity:1,shadowRadius:7},
  turboTitle:{color:'#E7E1FF',fontSize:9,fontWeight:'900',letterSpacing:1.3},
  turboLive:{marginLeft:'auto',color:'#82E9F3',fontSize:6,fontWeight:'900'},
  turboSub:{color:'#9E96B8',fontSize:6,letterSpacing:.7,marginTop:5},
  mobileCategories:{alignItems:'center',paddingHorizontal:8,paddingBottom:7,gap:6},
  mobileCategory:{paddingHorizontal:12,paddingVertical:7,borderRadius:18,backgroundColor:C.panel2,borderWidth:1,borderColor:C.line},
  toolList:{alignItems:'center',paddingHorizontal:4,paddingBottom:2},
  toolItem:{width:61,alignItems:'center',justifyContent:'center'},
  toolCircle:{width:39,height:39,borderRadius:21,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(35,51,91,.58)',borderWidth:1.3,borderTopColor:'rgba(255,255,255,.88)',borderLeftColor:'rgba(174,143,255,.82)',borderRightColor:'rgba(94,231,255,.92)',borderBottomColor:'rgba(70,89,160,.92)',shadowColor:'#65DFFF',shadowOpacity:.38,shadowRadius:13,elevation:9,overflow:'hidden'},
  toolCircleActive:{backgroundColor:'rgba(62,94,151,.82)',borderWidth:2,borderTopColor:'#FFFFFF',borderLeftColor:'#B69BFF',borderRightColor:'#68F0FF',borderBottomColor:'#8A79D9',shadowColor:'#67E8FF',shadowOpacity:.9,shadowRadius:18,elevation:16,transform:[{scale:1.08}]},
  toolGlyph:{color:'#D5D1EB',fontSize:17,fontWeight:'900',textShadowColor:'rgba(255,255,255,.35)',textShadowRadius:3},
  toolName:{color:C.muted,fontSize:6,fontWeight:'800',marginTop:4},
  engineNote:{color:C.muted,fontSize:6,textAlign:'center',paddingVertical:4},
  landscapeWorkspace:{flex:1,minHeight:0,flexDirection:'column',padding:6,gap:5},
  landscapeTopRow:{flex:1,minHeight:0,flexDirection:'row',gap:6},
  leftLibrary:{width:150,padding:9,borderRadius:12,backgroundColor:'#100E1B',borderWidth:1,borderColor:C.line},
  leftLibraryPremium:{width:142,padding:8,borderRadius:13,backgroundColor:'#0B1020',borderColor:'rgba(132,151,255,.28)'},
  sideBrand:{flexDirection:'row',alignItems:'center',gap:7,paddingBottom:13,borderBottomWidth:1,borderColor:C.line},
  sideBrandTitle:{color:C.white,fontSize:10,fontWeight:'900',letterSpacing:.7},
  sideBrandSub:{color:C.cyan,fontSize:6,fontWeight:'800',letterSpacing:1.1,marginTop:3},
  sideSection:{color:'#6F7E9F',fontSize:7,fontWeight:'900',letterSpacing:1.3,marginTop:15,marginBottom:7},
  sideNavItem:{height:35,flexDirection:'row',alignItems:'center',gap:9,paddingHorizontal:8,borderRadius:8,marginBottom:4},
  sideNavActive:{backgroundColor:'rgba(118,92,205,.2)',borderWidth:1,borderColor:'rgba(126,221,255,.38)'},
  sideNavGlyph:{width:17,color:C.cyan,fontSize:14,textAlign:'center'},
  sideNavText:{color:'#C4CDE2',fontSize:9,fontWeight:'800'},
  sideSpacer:{flex:1,minHeight:10},
  tokenCard:{padding:9,borderRadius:9,backgroundColor:'#151A30',borderWidth:1,borderColor:'rgba(122,220,255,.28)'},
  tokenLabel:{color:'#8795B4',fontSize:6,fontWeight:'900',letterSpacing:1},
  tokenValue:{color:C.white,fontSize:19,fontWeight:'900',marginTop:4},
  tokenUnit:{color:C.cyan,fontSize:7},
  tokenHint:{color:C.muted,fontSize:6,marginTop:2},
  sideVersion:{color:'#65728F',fontSize:5,fontWeight:'800',textAlign:'center',marginTop:9},
  workspaceBar:{height:36,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:9,marginBottom:5,borderRadius:9,backgroundColor:'#10162A',borderWidth:1,borderColor:C.line},
  workspaceTitle:{color:C.white,fontSize:10,fontWeight:'900'},
  workspaceSub:{color:'#8390AD',fontSize:6,letterSpacing:.7,marginTop:2},
  workspaceMeta:{alignItems:'flex-end',gap:3},
  workspaceMetaText:{color:C.cyan,fontSize:6,fontWeight:'900',letterSpacing:.5},
  rightPropertiesPremium:{backgroundColor:'#0B1020',borderColor:'rgba(132,151,255,.28)'},
  inspectorTabs:{height:27,flexDirection:'row',alignItems:'center',justifyContent:'space-around',borderBottomWidth:1,borderColor:C.line,marginBottom:8},
  inspectorTabActive:{color:C.cyan,fontSize:7,fontWeight:'900',letterSpacing:.7},
  inspectorTab:{color:'#72809E',fontSize:7,fontWeight:'900',letterSpacing:.7},
  desktopCommandBar:{height:49,flexDirection:'row',alignItems:'center',justifyContent:'space-around',marginHorizontal:7,marginBottom:5,paddingHorizontal:5,borderRadius:11,backgroundColor:'#111426',borderWidth:1,borderColor:'rgba(133,190,255,.3)'},
  commandItem:{minWidth:43,alignItems:'center',justifyContent:'center',paddingVertical:4,paddingHorizontal:5,borderRadius:7},
  commandItemActive:{backgroundColor:'rgba(115,221,255,.12)',borderWidth:1,borderColor:'rgba(115,221,255,.45)'},
  commandGlyph:{color:'#BDAEFF',fontSize:15,fontWeight:'900'},
  commandLabel:{color:'#B9C3DA',fontSize:6,fontWeight:'800',marginTop:3},

  leftLibraryWide:{width:205},
  categoryWrap:{flexDirection:'row',flexWrap:'wrap',gap:4,marginTop:9,marginBottom:8},
  categoryButton:{paddingHorizontal:8,paddingVertical:6,borderRadius:12,backgroundColor:C.panel2,borderWidth:1,borderColor:C.line},
  categoryActive:{borderColor:C.cyan,backgroundColor:'rgba(128,232,243,.10)'},
  categoryText:{color:C.muted,fontSize:8,fontWeight:'800'},
  desktopToolsGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},
  desktopTool:{width:'31%',alignItems:'center',marginBottom:10},
  desktopToolCircle:{width:35,height:35},
  desktopToolName:{fontSize:6,textAlign:'center'},
  centerWorkspace:{flex:1,minWidth:0,minHeight:0,flexDirection:'column',justifyContent:'flex-start'},
  desktopPreview:{flex:1,minHeight:0,margin:0,marginBottom:4,padding:8,borderRadius:11,borderColor:'rgba(135,157,255,.32)'},
  desktopCanvas:{aspectRatio:16/9,width:'100%',height:undefined,flexGrow:1,flexShrink:1,minHeight:0,maxHeight:'100%',alignSelf:'center',marginVertical:3},

  desktopTimeline:{padding:6,borderRadius:10,backgroundColor:'#0C1120',borderWidth:1,borderColor:'rgba(135,157,255,.28)',minHeight:104,marginTop:0,marginBottom:0,overflow:'hidden'},
  rightProperties:{width:150,padding:9,borderRadius:12,backgroundColor:'#100E1B',borderWidth:1,borderColor:C.line},
  rightPropertiesWide:{width:210},
  inspectorTitle:{color:C.white,fontSize:14,fontWeight:'900',marginTop:10},
  inspectorLabel:{color:C.cyan,fontSize:7,fontWeight:'900',letterSpacing:1,marginTop:15},
  inspectorValue:{color:C.white,fontSize:10,marginTop:6},
  inspectorDivider:{height:1,backgroundColor:C.line,marginVertical:10},
  inspectorOption:{minHeight:31,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderColor:'rgba(255,255,255,.06)'},
  inspectorNote:{color:C.muted,fontSize:7,lineHeight:12,marginTop:12},
  shortcutRow:{minHeight:35,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderColor:C.line},
  shortcutKey:{color:C.cyan,fontSize:9,fontWeight:'900',minWidth:105},
  modalBackdrop:{flex:1,flexDirection:'row',backgroundColor:'rgba(0,0,0,.72)'},
  drawer:{width:'82%',maxWidth:360,padding:20,paddingTop:45,backgroundColor:'#100E1A',borderRightWidth:1,borderColor:C.line},
  drawerHead:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:28},
  drawerItem:{height:54,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderColor:'rgba(255,255,255,.07)'},
  modalCenter:{flex:1,justifyContent:'center',alignItems:'center',padding:20,backgroundColor:'rgba(0,0,0,.78)'},
  dialog:{width:'100%',maxWidth:440,padding:17,borderRadius:20,backgroundColor:'#171326',borderWidth:1,borderColor:'rgba(193,163,255,.5)'},
  dialogHead:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:18},
  dialogTitle:{color:C.white,fontSize:12,fontWeight:'900',letterSpacing:1},
  choiceRow:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:9},
  choiceGrid:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:9},
  choice:{paddingHorizontal:13,paddingVertical:10,borderRadius:20,backgroundColor:C.panel2,borderWidth:1,borderColor:C.line},
  choiceHalf:{width:'22%',alignItems:'center',paddingHorizontal:2},
  choiceActive:{backgroundColor:'rgba(128,232,243,.17)',borderColor:C.cyan},
  nameInput:{color:C.white,fontSize:11,padding:12,marginTop:8,marginBottom:15,borderRadius:10,backgroundColor:C.panel,borderWidth:1,borderColor:C.line}
});

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ERROR PIXEL render error:', error, info);
  }

  render() {
    if (this.state.error) {
      const message = String(
        this.state.error && this.state.error.message
          ? this.state.error.message
          : this.state.error
      );
      return (
        <SafeAreaView style={{flex:1,backgroundColor:'#080711',padding:22,justifyContent:'center'}}>
          <StatusBar barStyle="light-content" backgroundColor="#080711" />
          <Text style={{color:'#80E8F3',fontSize:20,fontWeight:'900',marginBottom:12}}>
            ERROR PIXEL — APP ERROR
          </Text>
          <Text style={{color:'#F8F6FF',fontSize:13,lineHeight:20}}>
            {message}
          </Text>
          <Text style={{color:'#918BA7',fontSize:11,marginTop:18,lineHeight:17}}>
            یہ خرابی اسکرین پر دکھائی گئی ہے تاکہ خالی سفید اسکرین کے بجائے اصل مسئلہ معلوم ہو سکے۔
          </Text>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AppContent />
    </AppErrorBoundary>
  );
}