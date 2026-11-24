import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  StatusBar, StyleSheet, Modal, Linking,
  ActivityIndicator, TextInput, useWindowDimensions, Platform, Animated, Easing
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const C = {
  bg:'#080711', panel:'#151222', panel2:'#1C1730',
  white:'#F8F6FF', muted:'#918BA7', violet:'#A98BFF',
  cyan:'#80E8F3', pink:'#E3A9F2', gold:'#E9D39F',
  line:'rgba(205,188,255,.20)', green:'#65C8A9'
};

const TIKTOK = 'https://www.tiktok.com/@erroreditx99';

const SOCIAL = [
  {name:'TikTok',icon:'♪',color:'#80E8F3',url:TIKTOK},
  {name:'Instagram',icon:'◎',color:'#E9A1E9',url:'https://www.instagram.com/erroreditx99'},
  {name:'YouTube',icon:'▶',color:'#FF777D',url:'https://m.youtube.com/@erroreditx-o2t'},
  {name:'Facebook',icon:'f',color:'#65A8FF',url:'https://www.facebook.com/share/1CF15iyNv6/'}
];

const TOOL_GROUPS = {
  Edit: ['Selection','Hand','Import','Media Library','Media Search','Trim','Cut','Split','Slice','Crop','Resize','Rotate','Flip','Mirror','Reverse','Freeze Frame','Loop','Duplicate','Merge','Join','Razor Tool','Ripple Edit','Roll Edit','Slip','Slide','Delete','Speed','Speed Ramp','Time Remap','Frame Hold'],
  Motion: ['Keyframe','Graph Editor','Curve Editor','Velocity Curve','Ease In','Ease Out','Motion Blur','Motion Paths','Parenting','Anchor Point','Null Object','Expressions','Camera Tracking','3D Tracking'],
  Color: ['Color Correction','Color Grading','LUTs','HSL','Curves','Brightness','Contrast','Saturation','Exposure','Temperature','Tint','Shadows','Highlights','HDR','SDR','LOG to Rec.709','Sharpen','Blur','Denoise','Color Wheels','Vectorscope','Waveform Monitor','RGB Parade'],
  Audio: ['MP3 Cutter','MP4 Audio Extractor','Fade In','Fade Out','Equalizer','Reverb','Echo','Compressor','Limiter','Pitch Changer','Tempo Changer','Auto Tune','Noise Gate','Voice Changer','Voice Generator','Text to Speech','Speech to Text','Voice Cloning','AI Cover','AI Music Generator','Vocal Remover','Audacity AI Tools','CapCut Voice Changer','Noise Reduction','Auto Beat Sync','Bass Boost','Audio Ducking','Multitrack Audio'],
  Effects: ['Glitch','VHS','Old Film','Lens Flare','Light Leak','Bokeh','Chromatic Aberration','Distortion','Warp','Shake','Earthquake','3D','Particles','Smoke','Fire','Rain','Snow','Sky Replacement','Glow','Film Grain','Lens Blur'],
  Transitions: ['Zoom In','Zoom Out','Whip','Spin','Warp Transition','Glitch Transition','Morph','Cross Dissolve','Swipe','Camera L','Match Cut','Light Flash'],
  Text: ['Title Tool','Kinetic Typography','Auto Captions','Subtitle Generator','Logo Animation','Lower Third','Motion Graphics','Shape Tool','Vector Drawing','Pen Tool','3D Text','Text Tracking'],
  Advanced: ['Masking','Rotoscoping','Chroma Key','Green Screen','Motion Tracking','Face Tracking','Body Tracking','Camera Tracking','3D Tracking','Stabilization','Hyperlapse','Proxy Editing','Multi-Camera','Nested Sequences','Scene Detection','Beat Markers'],
  AI: ['AI Video Enhancer','AI Quality Upscaler','FPS Booster','RIFE AI','Flowframes','DAIN','CAIN','FLAVR','Real-ESRGAN','Waifu2x','ESRGAN','Remini AI','HitPaw Video Enhancer','Wink AI','AI Object Removal','AI Background Removal','AI Auto Reframe','AI Scene Generator','Image to Video','Video to Video','AI Denoiser','AI Stabilizer','AI Captions','AI Voice','AI Photo Enhancer'],
  Photo: ['Photo Crop','Photo Resize','Photo Rotate','Layers','Blend Modes','Healing Brush','Clone Stamp','Liquify','Perspective Correction','RAW Editing','Background Removal','Background Replacement','Photo Filters','Photo Color Grade','Photo Curves','Photo HSL','Photo Sharpen','Photo Denoise','Photo Upscale','Object Removal','Portrait Retouch','3D Photo'],
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
  Import:['Choose video','Choose audio','Choose image','Import folder','Search imported media'],
  Split:['Split at playhead','Split all tracks','Split selected track'],
  Trim:['Trim start','Trim end','Trim both sides'],
  Speed:['0.1×','0.25×','0.5×','0.75×','1×','1.5×','2×','4×','10×','25×','50×','100×','Speed curve','Frame Interpolation'],
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
    <View style={[s.logo,{width:size,height:size,borderRadius:size/2}]}>
      <View style={[s.logoRing,{width:size*.88,height:size*.88,borderRadius:size}]}/>
      <View style={[s.logoRing2,{width:size*.70,height:size*.70,borderRadius:size}]}/>
      <Text style={{color:'#fff',fontWeight:'900',fontSize:size*.34,
        textShadowColor:C.violet,textShadowRadius:12}}>EP</Text>
      <View style={[s.logoGlint,{width:size*.19}]}/>
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

function SocialDock({onOpen}) {
  return (
    <View style={s.socialDock}>
      {SOCIAL.map(x=>(
        <TouchableOpacity key={x.name} onPress={()=>onOpen(x.url)} style={s.socialButton}>
          <Text style={[s.socialIcon,{color:x.color}]}>{x.icon}</Text>
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

function ToolButton({item,active,onPress,compact=false}) {
  return (
    <TouchableOpacity style={compact?s.desktopTool:s.toolItem} onPress={onPress}>
      <View style={[s.toolCircle,active&&s.toolCircleActive,compact&&s.desktopToolCircle]}>
        <Text style={[s.toolGlyph,active&&{color:C.cyan}]}>{item[1]}</Text>
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
  const wide=width>=900;

  const [page,setPage]=useState('welcome');
  const [drawer,setDrawer]=useState(false);
  const [tool,setTool]=useState('Split');
  const [lastAction,setLastAction]=useState('Ready to edit');
  const [clips,setClips]=useState(1);
  const [playing,setPlaying]=useState(false);
  const [fps,setFps]=useState('60 FPS');
  const [playhead,setPlayhead]=useState(50);
  const [keyframes,setKeyframes]=useState([]);
  const [resolution,setResolution]=useState('1080p');
  const [modal,setModal]=useState('');
  const [helpQuestion,setHelpQuestion]=useState('');
  const [projectName,setProjectName]=useState('Untitled Project');
  const [trackCount,setTrackCount]=useState(12);
  const [category,setCategory]=useState('All');
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
  const [effectSearch,setEffectSearch]=useState('');
  const [mediaItems,setMediaItems]=useState([]);
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

  const chooseTool=name=>{
    saveHistory();
    setTool(name);
    setLastAction(name+' selected');
    if(name==='Split'){
      setClips(v=>v+1);
      setLastAction('Split action selected — demo timeline');
    }
    if(name==='Export')setModal('export');
    if(name==='Import')setLastAction('Media picker connection required');
    if(name==='Frame Interpolation')setLastAction('Choose Frame Blending, Optical Flow or AI Frame Generation in Speed / Interpolation options');
    if(name==='Keyframe'){setKeyframeActive(true);setKeyframes(v=>v.some(k=>k.track===0&&k.at===Math.round(playhead))?v:[...v,{track:0,at:Math.round(playhead)}]);}
  };

  const chooseOption=option=>{
    saveHistory();
    setLastAction(option+' selected');
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
    const next=[...projects,{name:projectName,date:new Date().toLocaleDateString()}];
    setProjects(next);
    try{await AsyncStorage.setItem('ERROR_PIXEL_PROJECTS',JSON.stringify(next));}
    catch(e){console.log(e);}
    setLastAction('Project saved locally');
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
  const openTool=name=>{setPage('editor');setTool(name);};
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
      maxHeight:height<430?124:Math.max(165,Math.min(250,Math.floor(height*.46))),
      flexShrink:0
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
            style={{maxHeight:desktop?(height<430?64:Math.max(90,Math.min(165,Math.floor(height*.31)))):190}}>
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
      height:height<430?88:Math.max(105,Math.min(155,Math.floor(height*.34))),
      flexGrow:0,flexShrink:0
    }]}>
      <View style={s.previewMeta}>
        <Text style={s.eyebrow}>PREVIEW MONITOR</Text>
        <Text style={s.smallMuted}>{resolution} · {fps}</Text>
      </View>
      <View style={[s.previewCanvas,desktop&&s.desktopCanvas,desktop&&{
        height:height<430?42:78,minHeight:height<430?42:65,maxHeight:height<430?48:100,
        flexGrow:1,marginVertical:2
      }]}>
        <EPLogo size={desktop?65:58}/>
        <Text style={s.previewBrand}>ERROR PIXEL</Text>
        <Text style={s.brandSub}>VIDEO PREVIEW AREA</Text>
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
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.homeContent}>
            <View style={s.topBar}>
              <View style={s.brandRow}>
                <EPLogo size={48}/>
                <View>
                  <Text style={s.brand}>ERROR <Text style={{color:C.violet}}>PIXEL</Text></Text>
                  <Text style={s.brandSub}>PRO CREATIVE WORKSPACE</Text>
                </View>
              </View>
              <View style={s.topActions}>
                <RoundButton onPress={()=>setPage('editor')}>
                  <Text style={s.buttonGlyph}>＋</Text>
                </RoundButton>
                <RoundButton onPress={()=>setDrawer(true)}>
                  <Text style={s.buttonGlyph}>☰</Text>
                </RoundButton>
              </View>
            </View>

            <View style={s.hero}>
              <View style={s.heroTop}><Text style={s.eyebrow}>FEATURED VIDEO SHOWCASE</Text><Text style={s.proBadge}>✦ PLAYLIST</Text></View>
              <View style={s.heroCenter}><EPLogo size={72}/><Text style={s.heroTitle}>CREATE WITHOUT LIMITS</Text><Text style={s.heroAccent}>VIDEO · PHOTO · AI</Text><Text style={s.heroCopy}>Featured creator videos and editing inspiration appear here when media is connected.</Text></View>
            </View>
            <View style={s.sectionRow}><View><Text style={s.eyebrow}>START CREATING</Text><Text style={s.sectionTitle}>New Project</Text></View></View>
            <View style={s.workspaceGrid}>
              <TouchableOpacity style={s.videoCard} onPress={()=>{setProjectType('video');setPage('editor');}}><Text style={s.cardIcon}>▶</Text><View><Text style={s.cardTitle}>NEW VIDEO</Text><Text style={s.cardTitle}>PROJECT</Text><Text style={s.cardSub}>MULTI-TRACK EDITOR</Text></View><Text style={s.cardArrow}>↗</Text></TouchableOpacity>
              <View style={s.sideCards}><TouchableOpacity style={s.smallCard} onPress={()=>{setProjectType('photo');setPage('photo');}}><Text style={s.cardIcon}>▧</Text><Text style={s.smallCardTitle}>EDIT PHOTO</Text></TouchableOpacity><TouchableOpacity style={s.smallCard} onPress={()=>setPage('templates')}><Text style={s.cardIcon}>▦</Text><Text style={s.smallCardTitle}>TEMPLATES</Text></TouchableOpacity></View>
            </View>
            <TouchableOpacity style={s.notification} onPress={()=>setPage('creator')}>
              <Text style={s.notificationGlyph}>✦</Text><View style={{flex:1}}><Text style={s.notificationHead}>YOUR CREATOR PROFILE · {activeRank.name.toUpperCase()}</Text><Text style={s.notificationText}>{creatorId} · {creatorPoints.toLocaleString()} Creator Points · {activeRank.reward} Premium reward</Text></View><Text style={s.link}>VIEW ↗</Text>
            </TouchableOpacity>
            <View style={s.dashboardMetrics}>
              {[
                ['PROJECTS',String(projects.length).padStart(2,'0'),'▣'],
                ['MEDIA ASSETS',String(mediaItems.length).padStart(2,'0'),'▤'],
                ['CREATOR LEVEL',activeRank.name,'✦']
              ].map(item=>(
                <View key={item[0]} style={s.metricCard}>
                  <Text style={s.metricIcon}>{item[2]}</Text>
                  <Text style={s.metricValue}>{item[1]}</Text>
                  <Text style={s.metricLabel}>{item[0]}</Text>
                </View>
              ))}
            </View>
            <View style={s.dashboardStatus}>
              <View style={{flex:1}}>
                <Text style={s.eyebrow}>WORKSPACE STATUS</Text>
                <Text style={s.dashboardStatusTitle}>Your creative studio is ready</Text>
                <Text style={s.smallMuted}>Video, photo and AI tools in one professional workspace</Text>
              </View>
              <View style={s.statusPill}><Text style={s.statusPillText}>READY</Text></View>
            </View>

            <View style={s.welcomeText}>
              <Text style={s.eyebrow}>WELCOME TO YOUR STUDIO</Text>
              <Text style={s.heading}>Your Studio.</Text>
              <Text style={s.body}>Professional tools. One creative environment.</Text>
            </View>

            <View style={s.hero}>
              <View style={s.heroTop}>
                <Text style={s.eyebrow}>ERROR PIXEL PRESENTS</Text>
                <Text style={s.proBadge}>✦ CREATOR</Text>
              </View>
              <View style={s.heroCenter}>
                <EPLogo size={100}/>
                <Text style={s.heroTitle}>MAKE EVERY</Text>
                <Text style={s.heroAccent}>FRAME COUNT.</Text>
                <Text style={s.heroCopy}>Edit videos, design visuals and explore advanced creative tools.</Text>
              </View>
              <TouchableOpacity style={s.newProject} onPress={()=>setPage('editor')}>
                <RoundButton onPress={()=>setPage('editor')}>
                  <Text style={s.buttonGlyph}>＋</Text>
                </RoundButton>
                <View style={{flex:1,marginLeft:12}}>
                  <Text style={s.newProjectTitle}>CREATE NEW PROJECT</Text>
                  <Text style={s.smallMuted}>Open professional editing workspace</Text>
                </View>
                <Text style={s.arrow}>↗</Text>
              </TouchableOpacity>
            </View>

            <View style={s.sectionRow}>
              <View>
                <Text style={s.eyebrow}>CHOOSE YOUR WORKSPACE</Text>
                <Text style={s.sectionTitle}>Creative Studio</Text>
              </View>
              <Text style={s.counter}>01 / 03</Text>
            </View>
            <View style={s.workspaceGrid}>
              <TouchableOpacity style={s.videoCard} onPress={()=>setPage('editor')}>
                <Text style={s.cardIcon}>▣</Text>
                <View>
                  <Text style={s.cardTitle}>VIDEO</Text>
                  <Text style={s.cardTitle}>EDITOR</Text>
                  <Text style={s.cardSub}>EDIT · EFFECTS · EXPORT</Text>
                </View>
                <Text style={s.cardArrow}>↗</Text>
              </TouchableOpacity>
              <View style={s.sideCards}>
                <TouchableOpacity style={s.smallCard} onPress={()=>setPage('photo')}>
                  <Text style={s.cardIcon}>◇</Text>
                  <Text style={s.smallCardTitle}>PHOTO STUDIO</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.smallCard,{borderColor:'rgba(227,169,242,.4)'}]}
                  onPress={()=>{setPage('editor');setTool('AI Enhance');}}>
                  <Text style={[s.cardIcon,{color:C.pink}]}>✦</Text>
                  <Text style={s.smallCardTitle}>AI STUDIO</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.sectionRow}>
              <View>
                <Text style={s.eyebrow}>FEATURE SHOWCASE</Text>
                <Text style={s.sectionTitle}>Explore Features</Text>
              </View>
              <Text style={s.link}>FEATURE PREVIEWS</Text>
            </View>
            <View style={s.previewGrid}>
              {PREVIEWS.map(item=>(
                <PreviewCard key={item.name} item={item} onPress={()=>{
                  setPage('editor');setTool(item.tool);
                }}/>
              ))}
            </View>

            <View style={s.sectionRow}>
              <View>
                <Text style={s.eyebrow}>CREATIVE TOOLKIT</Text>
                <Text style={s.sectionTitle}>Quick Tools</Text>
              </View>
              <TouchableOpacity onPress={()=>setPage('editor')}>
                <Text style={s.link}>OPEN EDITOR ↗</Text>
              </TouchableOpacity>
            </View>
            <View style={s.quickGrid}>
              {QUICK_TOOLS.map((name,i)=>(
                <TouchableOpacity key={name} style={s.quickTool} onPress={()=>{
                  setPage('editor');
                  setTool(name);
                }}>
                  <Text style={s.quickIcon}>{['✦','⤢','⏩','⌁','▧','⁙','⌖','◌','◐','▤','♫','⌫'][i]}</Text>
                  <Text style={s.quickLabel}>{name.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={s.sectionRow}>
              <View>
                <Text style={s.eyebrow}>SUPPORT</Text>
                <Text style={s.sectionTitle}>Need Help?</Text>
              </View>
            </View>
            <View style={s.helpRow}>
              <TouchableOpacity style={s.helpCard} onPress={()=>setPage('help')}>
                <Text style={s.helpIcon}>ⓘ</Text>
                <Text style={s.helpTitle}>HELP CENTER</Text>
                <Text style={s.smallMuted}>Guides and support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.helpCard} onPress={()=>setModal('aihelp')}>
                <Text style={[s.helpIcon,{color:C.pink}]}>✦</Text>
                <Text style={s.helpTitle}>AI HELP</Text>
                <Text style={s.smallMuted}>Ask editing questions</Text>
              </TouchableOpacity>
            </View>

            <View style={s.sectionRow}>
              <View>
                <Text style={s.eyebrow}>YOUR WORKSPACE</Text>
                <Text style={s.sectionTitle}>Recent Projects</Text>
              </View>
              <TouchableOpacity onPress={()=>setPage('projects')}>
                <Text style={s.link}>SEE ALL ↗</Text>
              </TouchableOpacity>
            </View>
            {projects.length===0?(
              <View style={s.emptyCard}>
                <EPLogo size={54}/>
                <Text style={s.emptyTitle}>Your next masterpiece starts here.</Text>
                <Text style={s.smallMuted}>Your saved projects will appear here.</Text>
              </View>
            ):projects.slice(-3).reverse().map((p,i)=>(
              <TouchableOpacity key={i} style={s.projectRow} onPress={()=>setPage('editor')}>
                <EPLogo size={38}/>
                <View style={{flex:1}}>
                  <Text style={s.helpTitle}>{p.name}</Text>
                  <Text style={s.smallMuted}>{p.date}</Text>
                </View>
                <Text style={s.link}>OPEN ↗</Text>
              </TouchableOpacity>
            ))}

            <View style={s.tiktokStats}>
              <View style={s.tiktokHead}>
                <View>
                  <Text style={s.eyebrow}>CREATOR SOCIAL DASHBOARD</Text>
                  <Text style={s.tiktokTitle}>TikTok Live Stats</Text>
                </View>
                <Text style={s.tiktokLogo}>♪</Text>
              </View>
              <View style={s.statsGrid}>
                {['FOLLOWERS','TOTAL LIKES','LIVE STATUS'].map(x=>(
                  <View key={x} style={s.statBox}>
                    <Text style={s.statNumber}>—</Text>
                    <Text style={s.statLabel}>{x}</Text>
                  </View>
                ))}
              </View>
              <Text style={s.statsNote}>Real-time account statistics and live streaming require an authorized TikTok integration.</Text>
              <TouchableOpacity style={s.connectButton} onPress={()=>openSocial(TIKTOK)}>
                <Text style={s.claimText}>OPEN TIKTOK PROFILE ↗</Text>
              </TouchableOpacity>
            </View>

            <View style={s.footer}>
              <Text style={s.brand}>ERROR PIXEL</Text>
              <Text style={s.brandSub}>POWERED BY MUNEEB HASSAN</Text>
              <TouchableOpacity onPress={()=>openSocial(TIKTOK)}>
                <Text style={s.channel}>ERROR EDITX99 · OPEN CHANNEL ↗</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <SocialDock onOpen={openSocial}/>
        </View>
      )}

      {page==='editor'&&(
        <View style={s.main}>
          <View style={s.editorTop}>
            <RoundButton onPress={()=>setPage('home')}>
              <Text style={s.buttonGlyph}>‹</Text>
            </RoundButton>
            <View style={{flex:1}}>
              <Text style={s.eyebrow}>{landscape?'AFTER EFFECTS STYLE WORKSPACE':'CAPCUT STYLE MOBILE EDITOR'}</Text>
              <Text style={s.projectName}>{projectName}</Text>
            </View>
            <TouchableOpacity style={s.shortcutTop} onPress={()=>setShortcutPanel(true)}>
              <Text style={s.exportTopText}>⌨ SHORTCUTS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.exportTop} onPress={()=>setModal('export')}>
              <Text style={s.exportTopText}>EXPORT ↑</Text>
            </TouchableOpacity>
          </View>

          {landscape?(
            <View style={s.landscapeWorkspace}>
              <View style={[s.leftLibrary,wide&&s.leftLibraryWide]}>
                <Text style={s.eyebrow}>TOOL LIBRARY</Text>
                <TextInput value={toolSearch} onChangeText={setToolSearch} placeholder="Search every editing tool..." placeholderTextColor={C.muted} style={s.nameInput}/>
                <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                  <View style={s.categoryWrap}>
                    {['All','Edit','Motion','Color','Audio','Effects','Transitions','Text','Advanced','AI','Photo','Output'].map(x=>(
                      <TouchableOpacity key={x} onPress={()=>setCategory(x)}
                        style={[s.categoryButton,category===x&&s.categoryActive]}>
                        <Text style={[s.categoryText,category===x&&{color:C.cyan}]}>{x}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={s.desktopToolsGrid}>
                    {visibleTools.map(x=>(
                      <ToolButton key={x[0]} item={x} active={tool===x[0]}
                        compact onPress={()=>chooseTool(x[0])}/>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={s.centerWorkspace}>
                <TurboEngine/>
                <PreviewMonitor desktop/>
                <EditorTools/>
                <Timeline desktop/>
              </View>

              <View style={[s.rightProperties,wide&&s.rightPropertiesWide]}>
                <Text style={s.eyebrow}>INSPECTOR</Text>
                <Text style={s.inspectorTitle}>{tool.toUpperCase()}</Text>
                <Text style={s.inspectorLabel}>SELECTED TOOL</Text>
                <Text style={s.inspectorValue}>{tool}</Text>
                <View style={s.inspectorDivider}/>
                <Text style={s.inspectorLabel}>AVAILABLE OPTIONS</Text>
                <ScrollView style={{flex:1}}>
                  {getToolOptions(tool).map(x=>(
                    <TouchableOpacity key={x} style={s.inspectorOption} onPress={()=>chooseOption(x)}>
                      <Text style={s.optionText}>{x}</Text>
                      <Text style={s.link}>›</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={s.inspectorDivider}/>
                <Text style={s.inspectorLabel}>PROJECT SETTINGS</Text>
                <Text style={s.smallMuted}>Resolution: {resolution}</Text>
                <Text style={s.smallMuted}>Frame rate: {fps}</Text>
                <TouchableOpacity style={s.connectButton} onPress={()=>setModal('export')}>
                  <Text style={s.claimText}>EXPORT SETTINGS</Text>
                </TouchableOpacity>
                <Text style={s.inspectorNote}>Processing engine required for final video rendering.</Text>
              </View>
            </View>
          ):(
            <View style={s.mobileEditor}>
              <TextInput value={toolSearch} onChangeText={setToolSearch} placeholder="Search video editing tools..." placeholderTextColor={C.muted} style={[s.nameInput,{marginHorizontal:9,marginTop:4,marginBottom:2}]}/>
              <PreviewMonitor/>
              <Timeline/>
              <View style={{paddingHorizontal:9,marginTop:3}}><TextInput value={mediaSearch} onChangeText={setMediaSearch} placeholder="Search imported videos, photos and project media..." placeholderTextColor={C.muted} style={s.nameInput}/></View>
              <View style={s.toolDock}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.mobileCategories}>
                  {['All','Edit','Motion','Color','Audio','Effects','Transitions','Text','Advanced','AI','Output'].map(x=>(
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
              <Text style={s.engineNote}>VIDEO PROCESSING ENGINE CONNECTION REQUIRED FOR FINAL EXPORT</Text>
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
                  <TouchableOpacity key={x} style={s.option} onPress={()=>setLastAction(x+' selected — image processing engine may be required')}>
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
              <TouchableOpacity style={s.connectButton} onPress={()=>setLastAction('Native media picker integration required to import files')}><Text style={s.claimText}>＋ IMPORT MEDIA</Text></TouchableOpacity>
              <Text style={s.statsNote}>Imported media will appear here after a native file-picker connection is added.</Text>
              {mediaItems.filter(x=>x.toLowerCase().includes(mediaSearch.toLowerCase())).map(x=><Text key={x} style={s.optionText}>{x}</Text>)}
            </ScrollView>
          )}
          {page==='templates'&&(
            <ScrollView contentContainerStyle={s.subContent}>
              <TextInput value={templateSearch} onChangeText={setTemplateSearch} placeholder="Search templates and creator packs..." placeholderTextColor={C.muted} style={s.nameInput}/>
              <View style={s.hero}><Text style={s.heroTitle}>TEMPLATE MARKETPLACE</Text><Text style={s.heroCopy}>Discover creator templates, transitions, presets and effects.</Text></View>
              {['Trending Templates','New Releases','Popular Creator Packs','My Uploaded Templates'].map(x=><TouchableOpacity key={x} style={s.projectRow} onPress={()=>setLastAction(x+' — marketplace backend required')}><Text style={s.cardIcon}>▦</Text><Text style={s.helpTitle}>{x}</Text><Text style={s.link}>OPEN ↗</Text></TouchableOpacity>)}
              <TouchableOpacity style={s.connectButton} onPress={()=>setLastAction('Template upload requires verified Template Creator access and cloud storage')}><Text style={s.claimText}>＋ UPLOAD TEMPLATE</Text></TouchableOpacity>
              <Text style={s.statsNote}>Publishing and downloading templates requires cloud storage, moderation and marketplace APIs.</Text>
            </ScrollView>
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
              {TOOL_GROUPS.Effects.concat(TOOL_GROUPS.Transitions).filter(x=>x.toLowerCase().includes(effectSearch.toLowerCase())).map(x=><TouchableOpacity key={x} style={s.option} onPress={()=>{setPage('editor');setTool(x);}}><Text style={s.optionText}>{x}</Text></TouchableOpacity>)}
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
                  {modal==='export'?'EXPORT SETTINGS':modal==='aihelp'?'ERROR PIXEL AI HELP':'HELP CENTER'}
                </Text>
                <Text style={s.brandSub}>ERROR PIXEL STUDIO</Text>
              </View>
              <RoundButton onPress={()=>setModal('')}>
                <Text style={s.buttonGlyph}>×</Text>
              </RoundButton>
            </View>

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
  ambient:{position:'absolute',width:320,height:320,borderRadius:160,backgroundColor:'rgba(140,99,220,.10)'},
  logo:{alignItems:'center',justifyContent:'center',backgroundColor:'#19132B',borderWidth:2,borderColor:'rgba(193,166,255,.85)',shadowColor:C.violet,shadowOpacity:.6,shadowRadius:16,elevation:12,overflow:'hidden'},
  logoRing:{position:'absolute',borderWidth:2,borderColor:'rgba(128,232,243,.8)',borderTopColor:C.pink},
  logoRing2:{position:'absolute',borderWidth:1.5,borderColor:'rgba(227,169,242,.7)',borderLeftColor:C.gold},
  logoGlint:{position:'absolute',height:3,borderRadius:4,top:'22%',right:'18%',backgroundColor:C.cyan,transform:[{rotate:'-35deg'}]},
  welcomeBrand:{color:C.white,fontSize:31,fontWeight:'900',letterSpacing:2,marginTop:28},
  tag:{color:C.cyan,fontSize:8,letterSpacing:2.4,marginTop:10},
  loadingLine:{flexDirection:'row',alignItems:'center',gap:9,marginTop:42},
  loadingText:{color:C.cyan,fontSize:8,letterSpacing:1.4},
  powered:{color:C.muted,fontSize:8,letterSpacing:1.5,marginTop:24},
  channel:{color:C.violet,fontSize:10,fontWeight:'900',letterSpacing:2,marginTop:8},
  homeContent:{padding:18,paddingBottom:50},
  dashboardMetrics:{flexDirection:'row',gap:9,marginTop:18},
  metricCard:{flex:1,minWidth:0,minHeight:104,padding:12,borderRadius:15,backgroundColor:'#151923',borderWidth:1,borderColor:'rgba(150,170,205,.22)'},
  metricIcon:{color:C.cyan,fontSize:16,fontWeight:'900'},
  metricValue:{color:C.white,fontSize:17,fontWeight:'900',marginTop:10},
  metricLabel:{color:C.muted,fontSize:7,fontWeight:'800',letterSpacing:.8,marginTop:5},
  dashboardStatus:{flexDirection:'row',alignItems:'center',gap:12,padding:15,marginTop:10,borderRadius:15,backgroundColor:'#131A20',borderWidth:1,borderColor:'rgba(101,200,169,.25)'},
  dashboardStatusTitle:{color:C.white,fontSize:13,fontWeight:'800',marginTop:6},
  statusPill:{paddingHorizontal:11,paddingVertical:7,borderRadius:20,backgroundColor:'rgba(101,200,169,.13)',borderWidth:1,borderColor:'rgba(101,200,169,.4)'},
  statusPillText:{color:C.green,fontSize:8,fontWeight:'900',letterSpacing:1},
  topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:18},
  topActions:{flexDirection:'row',gap:8},
  brandRow:{flexDirection:'row',alignItems:'center',gap:10},
  brand:{color:C.white,fontSize:16,fontWeight:'900',letterSpacing:1.2},
  brandSub:{color:C.cyan,fontSize:6,letterSpacing:1.4,marginTop:4},
  roundButton:{width:40,height:40,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(169,139,255,.13)',borderWidth:1,borderColor:'rgba(205,188,255,.38)'},
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
  hero:{padding:17,borderRadius:18,backgroundColor:'#171B25',borderWidth:1,borderColor:'rgba(150,170,205,.25)'},
  heroTop:{flexDirection:'row',justifyContent:'space-between'},
  proBadge:{color:C.gold,fontSize:7,borderWidth:1,borderColor:'rgba(233,211,159,.4)',borderRadius:20,padding:7,overflow:'hidden'},
  heroCenter:{alignItems:'center',paddingVertical:20},
  heroTitle:{color:C.white,fontSize:22,fontWeight:'900',letterSpacing:1.5,marginTop:12},
  heroAccent:{color:C.violet,fontSize:24,fontWeight:'900',letterSpacing:2},
  heroCopy:{color:C.muted,fontSize:9,textAlign:'center',lineHeight:15,maxWidth:250,marginTop:9},
  newProject:{flexDirection:'row',alignItems:'center',padding:10,borderRadius:30,backgroundColor:'rgba(255,255,255,.06)',borderWidth:1,borderColor:C.line},
  newProjectTitle:{color:C.white,fontSize:9,fontWeight:'900',letterSpacing:.8},
  arrow:{color:C.cyan,fontSize:20},
  sectionRow:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',marginTop:25,marginBottom:12},
  sectionTitle:{color:C.white,fontSize:18,fontWeight:'900',marginTop:5},
  counter:{color:C.muted,fontSize:8},
  workspaceGrid:{flexDirection:'row',gap:9},
  videoCard:{width:'49%',minHeight:170,padding:14,borderRadius:15,justifyContent:'space-between',backgroundColor:'#18202B',borderWidth:1,borderColor:'rgba(150,170,205,.28)'},
  cardIcon:{color:C.violet,fontSize:28},
  cardTitle:{color:C.white,fontSize:18,fontWeight:'900'},
  cardSub:{color:C.cyan,fontSize:6,letterSpacing:1,marginTop:7},
  cardArrow:{color:C.white,fontSize:20,position:'absolute',right:13,bottom:12},
  sideCards:{flex:1,gap:9},
  smallCard:{flex:1,padding:12,borderRadius:14,justifyContent:'center',backgroundColor:'#18212A',borderWidth:1,borderColor:'rgba(150,170,205,.24)'},
  smallCardTitle:{color:C.white,fontSize:9,fontWeight:'900',marginTop:7},
  link:{color:C.cyan,fontSize:8,fontWeight:'900',letterSpacing:.7},
  previewGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:10},
  previewCard:{width:'48%',padding:9,borderRadius:16,backgroundColor:C.panel,borderWidth:1,borderColor:C.line},
  previewVisual:{height:91,borderRadius:11,backgroundColor:'#1B1630',borderWidth:1,alignItems:'center',justifyContent:'center'},
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
  projectRow:{flexDirection:'row',alignItems:'center',gap:12,padding:13,marginBottom:9,borderRadius:15,backgroundColor:C.panel,borderWidth:1,borderColor:C.line},
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
  option:{paddingHorizontal:12,paddingVertical:9,borderRadius:9,marginRight:6,marginBottom:7,backgroundColor:'#26213B',borderWidth:1,borderTopColor:'rgba(255,255,255,.38)',borderLeftColor:'rgba(189,168,255,.4)',borderRightColor:'rgba(105,216,238,.34)',borderBottomColor:'rgba(70,57,110,.9)'},
  optionText:{color:C.white,fontSize:8,fontWeight:'800'},
  plan:{padding:18,borderRadius:17,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,marginBottom:12},
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
  toolPanel:{marginHorizontal:8,marginTop:5,padding:9,borderRadius:13,backgroundColor:'#17162A',borderWidth:1,borderTopColor:'rgba(255,255,255,.42)',borderLeftColor:'rgba(181,157,255,.45)',borderRightColor:'rgba(102,220,240,.32)',borderBottomColor:'rgba(82,67,128,.85)'},
  toolPanelHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:7,gap:8},
  toolTitle:{color:C.white,fontSize:11,fontWeight:'900',marginTop:3},
  toolDock:{position:'absolute',left:0,right:0,bottom:0,paddingTop:7,paddingBottom:8,backgroundColor:'#100F1D',borderTopWidth:1,borderTopColor:'rgba(219,207,255,.55)',borderBottomColor:'rgba(70,205,231,.45)',elevation:22,zIndex:20,shadowColor:'#8E79E8',shadowOpacity:.32,shadowRadius:14},
  mobileOptionList:{alignItems:'center',paddingHorizontal:7,paddingTop:6,gap:6},
  mobileOption:{paddingHorizontal:10,paddingVertical:7,borderRadius:8,backgroundColor:'#25213B',borderWidth:1,borderTopColor:'rgba(255,255,255,.4)',borderLeftColor:'rgba(190,170,255,.45)',borderRightColor:'rgba(106,220,240,.35)',borderBottomColor:'rgba(70,57,110,.9)'},
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
  toolCircle:{width:39,height:39,borderRadius:21,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(255,255,255,.055)',borderWidth:1,borderColor:'rgba(205,188,255,.17)'},
  toolCircleActive:{backgroundColor:'#292D50',borderColor:C.cyan,shadowColor:C.cyan,shadowOpacity:.55,shadowRadius:9,elevation:8},
  toolGlyph:{color:'#D5D1EB',fontSize:17,fontWeight:'900',textShadowColor:'rgba(255,255,255,.35)',textShadowRadius:3},
  toolName:{color:C.muted,fontSize:6,fontWeight:'800',marginTop:4},
  engineNote:{color:C.muted,fontSize:6,textAlign:'center',paddingVertical:4},
  landscapeWorkspace:{flex:1,flexDirection:'row',padding:7,gap:7},
  leftLibrary:{width:150,padding:9,borderRadius:12,backgroundColor:'#100E1B',borderWidth:1,borderColor:C.line},
  leftLibraryWide:{width:205},
  categoryWrap:{flexDirection:'row',flexWrap:'wrap',gap:4,marginTop:9,marginBottom:8},
  categoryButton:{paddingHorizontal:8,paddingVertical:6,borderRadius:12,backgroundColor:C.panel2,borderWidth:1,borderColor:C.line},
  categoryActive:{borderColor:C.cyan,backgroundColor:'rgba(128,232,243,.10)'},
  categoryText:{color:C.muted,fontSize:8,fontWeight:'800'},
  desktopToolsGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},
  desktopTool:{width:'31%',alignItems:'center',marginBottom:10},
  desktopToolCircle:{width:35,height:35},
  desktopToolName:{fontSize:6,textAlign:'center'},
  centerWorkspace:{flex:1,minWidth:0,flexDirection:'column',justifyContent:'flex-start'},
  desktopPreview:{height:150,flexGrow:0,flexShrink:0,margin:0,marginBottom:4,minHeight:0},
  desktopCanvas:{height:78,width:'75%',flexGrow:1,minHeight:65,maxHeight:100,marginVertical:3},
  desktopTimeline:{padding:5,borderRadius:12,backgroundColor:'#100E1B',borderWidth:1,borderColor:C.line,maxHeight:290,flexShrink:0,marginTop:4,marginBottom:0},
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