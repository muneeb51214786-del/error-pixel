import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  StatusBar, StyleSheet, Modal, Linking, Animated, Easing,
  ActivityIndicator, TextInput, useWindowDimensions, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const C = {
  bg:'#080711', panel:'#151222', panel2:'#1C1730',
  white:'#F8F6FF', muted:'#918BA7', violet:'#A98BFF',
  cyan:'#80E8F3', pink:'#E3A9F2', gold:'#E9D39F',
  line:'rgba(205,188,255,.20)', green:'#65C8A9'
};

const DAILY_REWARD = 3;
const TIKTOK = 'https://www.tiktok.com/@erroreditx99';

const SOCIAL = [
  {name:'TikTok',icon:'♪',color:'#80E8F3',url:TIKTOK},
  {name:'Instagram',icon:'◎',color:'#E9A1E9',url:'https://www.instagram.com/erroreditx99'},
  {name:'YouTube',icon:'▶',color:'#FF777D',url:'https://m.youtube.com/@erroreditx-o2t'},
  {name:'Facebook',icon:'f',color:'#65A8FF',url:'https://www.facebook.com/share/1CF15iyNv6/'}
];

const TOOLS = [
  ['Selection','↖','Edit'],['Hand','✋','Edit'],
  ['Import','＋','Media'],['Media Library','▣','Media'],
  ['Split','✂','Edit'],['Trim','↔','Edit'],['Delete','⌫','Edit'],
  ['Duplicate','▣','Edit'],['Crop','⌗','Edit'],['Rotate','⟳','Edit'],
  ['Flip','⇄','Edit'],['Speed','◷','Edit'],['Speed Ramp','⌁','Motion'],
  ['Reverse','↶','Edit'],['Freeze Frame','❄','Edit'],
  ['Audio','♫','Sound'],['Music','♬','Sound'],
  ['Voiceover','◉','Sound'],['Noise Removal','⁙','Sound'],
  ['Audio Mixer','≋','Sound'],['Text','T','Overlay'],
  ['Captions','▤','Overlay'],['Stickers','☆','Overlay'],
  ['Subtitles','Aa','Overlay'],['Effects','✧','Visual'],
  ['Transitions','◈','Visual'],['Filters','◐','Visual'],
  ['Adjust','☼','Visual'],['Color Grade','◒','Visual'],
  ['LUTs','▧','Visual'],['Keyframe','◇','Motion'],
  ['Graph Editor','⌁','Motion'],['Motion Blur','≋','Motion'],
  ['Tracking','◎','Advanced'],['Mask','◒','Advanced'],
  ['Chroma Key','▧','Advanced'],['Blend','◈','Advanced'],
  ['3D','⬡','3D'],['Camera','◉','3D'],['Lighting','☼','3D'],
  ['AI Enhance','✦','AI'],['AI Upscale','⤢','AI'],
  ['AI Stabilize','⌖','AI'],['AI Denoise','⁙','AI'],
  ['Background Remove','◌','AI'],['Object Remove','⌫','AI'],
  ['Frame Interpolation','⏩','AI'],['Optical Flow','⌁','AI'],
  ['AI Captions','▤','AI'],['AI Voice','◉','AI'],
  ['Photo Enhance','✧','Photo'],['Photo Crop','⌗','Photo'],
  ['Background Blur','◌','Photo'],['3D Photo','⬡','Photo'],
  ['Export','⇧','Output']
];

const OPTIONS = {
  Import:['Choose video','Choose audio','Choose image','Import folder'],
  Split:['Split at playhead','Split all tracks','Split selected track'],
  Trim:['Trim start','Trim end','Trim both sides'],
  Speed:['0.25×','0.5×','0.75×','1×','1.5×','2×','4×','Speed curve'],
  'Speed Ramp':['Montage','Hero','Bullet time','Custom curve'],
  Crop:['Original','16:9','9:16','1:1','4:5','Custom'],
  Adjust:['Exposure','Contrast','Saturation','Temperature','Tint','Highlights','Shadows','HSL','Curves'],
  Effects:['Video effects','Light effects','Glow','Glitch','Blur','Distortion'],
  Filters:['Cinema','Vintage','Portrait','Film','Moody','Warm'],
  Audio:['Music','Sound effects','Voiceover','Audio mixer'],
  Text:['Add text','Fonts','Text animation','3D text','Subtitles'],
  'Color Grade':['Basic correction','Color wheels','HSL','Curves','LUT library'],
  'Frame Interpolation':['Frame Blending','Optical Flow','AI Frame Generation'],
  'AI Enhance':['Enhance details','Reduce noise','Improve clarity'],
  Export:['720p','1080p','2K','4K','24 FPS','30 FPS','60 FPS','90 FPS','120 FPS','144 FPS','160 FPS','180 FPS','200 FPS','240 FPS']
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
  const spin=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    const loop=Animated.loop(Animated.timing(spin,{
      toValue:1,duration:5000,easing:Easing.linear,useNativeDriver:true
    }));
    loop.start();
    return ()=>loop.stop();
  },[spin]);
  const rotate=spin.interpolate({inputRange:[0,1],outputRange:['0deg','360deg']});
  return (
    <View style={[s.logo,{width:size,height:size,borderRadius:size/2}]}>
      <Animated.View style={[s.logoRing,{
        width:size*.88,height:size*.88,borderRadius:size,
        transform:[{rotate}]
      }]}/>
      <Animated.View style={[s.logoRing2,{
        width:size*.70,height:size*.70,borderRadius:size,
        transform:[{rotate}]
      }]}/>
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
  const pulse=useRef(new Animated.Value(.78)).current;
  useEffect(()=>{
    const loop=Animated.loop(Animated.sequence([
      Animated.timing(pulse,{toValue:1,duration:900,useNativeDriver:true}),
      Animated.timing(pulse,{toValue:.78,duration:900,useNativeDriver:true})
    ]));
    loop.start();
    return ()=>loop.stop();
  },[pulse]);
  return (
    <TouchableOpacity style={s.previewCard} onPress={onPress}>
      <View style={[s.previewVisual,{borderColor:item.color+'66'}]}>
        <Animated.View style={{opacity:pulse,transform:[{scale:pulse}]}}>
          <Text style={[s.previewIcon,{color:item.color}]}>{item.icon}</Text>
        </Animated.View>
        <Text style={s.previewPlay}>▶ FEATURE PREVIEW</Text>
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

export default function App() {
  const {width,height}=useWindowDimensions();
  const landscape=width>height;
  const wide=width>=900;

  const [page,setPage]=useState('welcome');
  const [drawer,setDrawer]=useState(false);
  const [tokens,setTokens]=useState(0);
  const [claimDate,setClaimDate]=useState('');
  const [claimStep,setClaimStep]=useState('idle');
  const [tool,setTool]=useState('Split');
  const [lastAction,setLastAction]=useState('Ready to edit');
  const [clips,setClips]=useState(1);
  const [playing,setPlaying]=useState(false);
  const [fps,setFps]=useState('60 FPS');
  const [resolution,setResolution]=useState('1080p');
  const [modal,setModal]=useState('');
  const [helpQuestion,setHelpQuestion]=useState('');
  const [projectName,setProjectName]=useState('Untitled Project');
  const [trackCount,setTrackCount]=useState(5);
  const [category,setCategory]=useState('All');
  const [projects,setProjects]=useState([]);
  const [keyframeActive,setKeyframeActive]=useState(false);
  const [shortcutPanel,setShortcutPanel]=useState(false);

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
    if(name==='Keyframe')setKeyframeActive(v=>!v);
  };

  const chooseOption=option=>{
    saveHistory();
    setLastAction(option+' selected');
    if(tool==='Split')setClips(v=>v+1);
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
        const [b,d,p]=await Promise.all([
          AsyncStorage.getItem('ERROR_PIXEL_BALANCE'),
          AsyncStorage.getItem('ERROR_PIXEL_DAILY_CLAIM_DATE'),
          AsyncStorage.getItem('ERROR_PIXEL_PROJECTS')
        ]);
        if(!mounted)return;
        if(b!==null)setTokens(Number(b)||0);
        if(d){
          setClaimDate(d);
          if(d===today())setClaimStep('claimed');
        }
        if(p)setProjects(JSON.parse(p));
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

  const claimDaily=async()=>{
    if(claimDate===today())return;
    setClaimStep('visited');
    await openSocial(TIKTOK);
  };

  const collectTokens=async()=>{
    if(claimDate===today())return;
    const balance=tokens+DAILY_REWARD;
    const date=today();
    setTokens(balance);
    setClaimDate(date);
    setClaimStep('claimed');
    try{
      await AsyncStorage.multiSet([
        ['ERROR_PIXEL_BALANCE',String(balance)],
        ['ERROR_PIXEL_DAILY_CLAIM_DATE',date]
      ]);
    }catch(e){console.log('Save tokens:',e);}
  };

  const saveProject=async()=>{
    const next=[...projects,{name:projectName,date:new Date().toLocaleDateString()}];
    setProjects(next);
    try{await AsyncStorage.setItem('ERROR_PIXEL_PROJECTS',JSON.stringify(next));}
    catch(e){console.log(e);}
    setLastAction('Project saved locally');
  };

  const menu=[
    ['Dashboard','home'],['Video Editor','editor'],
    ['Photo Studio','photo'],['My Projects','projects'],
    ['Membership','membership'],['Help Center','help']
  ];

  const visibleTools=category==='All'?TOOLS:
    TOOLS.filter(x=>x[2]===category);

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
        {(OPTIONS[tool]||['Select','Adjust','Settings','Apply']).map(x=>(
          <TouchableOpacity key={x} style={s.option} onPress={()=>chooseOption(x)}>
            <Text style={s.optionText}>{x}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const Timeline=({desktop=false})=>(
    <View style={[s.timelineBox,desktop&&s.desktopTimeline]}>
      <View style={s.timelineHead}>
        <View>
          <Text style={s.eyebrow}>MULTI-TRACK SEQUENCE</Text>
          <Text style={s.sectionTitle}>Timeline</Text>
        </View>
        <TouchableOpacity onPress={()=>setTrackCount(v=>Math.min(v+1,12))}>
          <Text style={s.link}>＋ TRACK</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{minWidth:620}}>
          <View style={s.rulerInner}>
            {['00:00','00:03','00:06','00:09','00:12','00:15','00:18','00:21'].map(x=>(
              <Text key={x} style={s.rulerText}>{x}</Text>
            ))}
          </View>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={true}
            style={{maxHeight:desktop?135:190}}>
            {Array.from({length:trackCount},(_,i)=>({
              name:['VIDEO 01','AUDIO','OVERLAY','EFFECTS','TEXT','VIDEO 02','VOICEOVER','MUSIC','CAPTIONS','GRAPHICS','MASK','ADJUSTMENT'][i],
              color:['#9877F4','#39A6A8','#C17BCB','#D39A55','#5D9BD8','#8064B8','#42A8A0','#BD8C4F','#6289C7','#9E6FA9','#A17A68','#4F9D8B'][i]
            })).map((x,i)=>(
              <View key={x.name} style={s.track}>
                <Text style={s.trackName}>{x.name}</Text>
                <View style={s.trackLane}>
                  <View style={[s.clip,{
                    width:Math.min(150+clips*24,390),
                    backgroundColor:x.color
                  }]}>
                    <Text style={s.clipText}>
                      {i===0?'VIDEO CLIP '+clips:x.name+' LAYER'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );

  const PreviewMonitor=({desktop=false})=>(
    <View style={[s.preview,desktop&&s.desktopPreview]}>
      <View style={s.previewMeta}>
        <Text style={s.eyebrow}>PREVIEW MONITOR</Text>
        <Text style={s.smallMuted}>{resolution} · {fps}</Text>
      </View>
      <View style={[s.previewCanvas,desktop&&s.desktopCanvas]}>
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

            <View style={s.notification}>
              <Text style={s.notificationGlyph}>◉</Text>
              <View style={{flex:1}}>
                <Text style={s.notificationHead}>STUDIO NOTIFICATION</Text>
                <Text style={s.notificationText}>
                  {claimStep==='claimed'?'Your daily Error Tokens have been collected.':
                  claimStep==='visited'?'TikTok opened. Return and collect your tokens.':
                  'Your daily creator reward is ready.'}
                </Text>
              </View>
            </View>

            <View style={s.tokenCard}>
              <View style={{flex:1}}>
                <Text style={s.eyebrow}>DAILY CREATOR REWARD</Text>
                <Text style={s.tokenHeading}>ERROR TOKENS</Text>
                <Text style={s.tokenCount}>{tokens} <Text style={s.tokenUnit}>TOKENS</Text></Text>
                <Text style={s.smallMuted}>Daily reward · +{DAILY_REWARD} tokens</Text>
              </View>
              <View style={s.tokenRight}>
                <View style={s.tokenCoin}><Text style={s.coinGlyph}>E</Text></View>
                <TouchableOpacity disabled={claimStep==='claimed'}
                  style={[s.claimButton,claimStep==='claimed'&&s.claimDisabled]}
                  onPress={claimStep==='visited'?collectTokens:claimDaily}>
                  <Text style={s.claimText}>
                    {claimStep==='claimed'?'CLAIMED':claimStep==='visited'?'COLLECT':'CLAIM'}
                  </Text>
                </TouchableOpacity>
                <Text style={s.claimHint}>{claimStep==='claimed'?'NEXT CLAIM TOMORROW':'VISIT TIKTOK FIRST'}</Text>
              </View>
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
              {[
                ['✦','AI ENHANCE'],['⤢','4K UPSCALE'],['⌁','MOTION BLUR'],
                ['T','3D TEXT'],['◐','COLOR GRADE'],['◎','TRACKING']
              ].map(x=>(
                <TouchableOpacity key={x[1]} style={s.quickTool} onPress={()=>{
                  setPage('editor');
                  setTool(x[1]==='AI ENHANCE'?'AI Enhance':x[1]==='COLOR GRADE'?'Color Grade':x[1]==='TRACKING'?'Tracking':'Effects');
                }}>
                  <Text style={s.quickIcon}>{x[0]}</Text>
                  <Text style={s.quickLabel}>{x[1]}</Text>
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
              <Text style={s.channel}>ERROR EDITX99</Text>
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
              <Text style={s.eyebrow}>ERROR PIXEL / EDITOR</Text>
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
                <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                  <View style={s.categoryWrap}>
                    {['All','Media','Edit','Motion','Sound','Overlay','Visual','Advanced','3D','AI','Photo','Output'].map(x=>(
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
                <PreviewMonitor desktop/>
                <Timeline desktop/>
                <EditorTools/>
              </View>

              <View style={[s.rightProperties,wide&&s.rightPropertiesWide]}>
                <Text style={s.eyebrow}>INSPECTOR</Text>
                <Text style={s.inspectorTitle}>{tool.toUpperCase()}</Text>
                <Text style={s.inspectorLabel}>SELECTED TOOL</Text>
                <Text style={s.inspectorValue}>{tool}</Text>
                <View style={s.inspectorDivider}/>
                <Text style={s.inspectorLabel}>AVAILABLE OPTIONS</Text>
                <ScrollView style={{flex:1}}>
                  {(OPTIONS[tool]||['Select','Adjust','Settings','Apply']).map(x=>(
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
              <PreviewMonitor/>
              <Timeline/>
              <EditorTools/>
              <View style={s.toolDock}>
                <Text style={s.dockCaption}>PRO TOOLS · SWIPE TO EXPLORE</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.toolList}>
                  {TOOLS.map(x=>(
                    <ToolButton key={x[0]} item={x} active={tool===x[0]}
                      onPress={()=>chooseTool(x[0])}/>
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
                {['Canvas','Crop','Background Blur','3D Photo','3D Text','Image Shadow','AI Image','Stickers','Filters','Color Grade','Upscale','Remove Background'].map(x=>(
                  <TouchableOpacity key={x} style={s.option} onPress={()=>setLastAction(x+' selected')}>
                    <Text style={s.optionText}>{x}</Text>
                  </TouchableOpacity>
                ))}
              </View>
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

          {page==='membership'&&(
            <ScrollView contentContainerStyle={s.subContent}>
              {[
                ['WEEKLY','Rs. 350','150 Error Tokens'],
                ['MONTHLY','Rs. 1,200','800 Error Tokens'],
                ['YEARLY','Rs. 9,000','10,000 Error Tokens'],
                ['LIFETIME','Rs. 30,000','Premium access']
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
                  {['720p','1080p','2K','4K'].map(x=>(
                    <TouchableOpacity key={x} onPress={()=>setResolution(x)}
                      style={[s.choice,resolution===x&&s.choiceActive]}>
                      <Text style={s.optionText}>{x}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[s.eyebrow,{marginTop:15}]}>FRAME RATE</Text>
                <View style={s.choiceGrid}>
                  {['24 FPS','30 FPS','60 FPS','90 FPS','120 FPS','144 FPS','160 FPS','180 FPS','200 FPS','240 FPS'].map(x=>(
                    <TouchableOpacity key={x} onPress={()=>setFps(x)}
                      style={[s.choice,s.choiceHalf,fps===x&&s.choiceActive]}>
                      <Text style={s.optionText}>{x}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={s.eyebrow}>SLOW MOTION FRAME GENERATION</Text>
                <View style={s.option}>
                  <Text style={s.optionText}>Frame Blending · Optical Flow · AI Frame Generation</Text>
                </View>
                <Text style={s.statsNote}>
                  These are export settings only. Actual rendering, frame interpolation and AI processing require a connected video-processing engine. Output FPS also depends on the source footage and encoder.
                </Text>
                <TouchableOpacity style={s.connectButton} onPress={()=>{
                  setLastAction('Export settings saved: '+resolution+' · '+fps);
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
  homeContent:{padding:17,paddingBottom:45},
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
  tokenCard:{flexDirection:'row',alignItems:'center',padding:16,marginBottom:22,borderRadius:21,backgroundColor:'#19142A',borderWidth:1,borderColor:'rgba(169,139,255,.48)'},
  eyebrow:{color:C.cyan,fontSize:7,letterSpacing:1.4,fontWeight:'800'},
  tokenHeading:{color:C.white,fontSize:13,fontWeight:'900',letterSpacing:1.2,marginTop:5},
  tokenCount:{color:'#fff',fontSize:26,fontWeight:'900',marginTop:4},
  tokenUnit:{color:C.violet,fontSize:8,letterSpacing:1},
  smallMuted:{color:C.muted,fontSize:8,marginTop:5},
  tokenRight:{alignItems:'center',marginLeft:8},
  tokenCoin:{width:39,height:39,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:'#44336D',borderWidth:1,borderColor:C.gold,marginBottom:8},
  coinGlyph:{color:C.gold,fontSize:21,fontWeight:'900'},
  claimButton:{minWidth:92,height:38,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:'#8060C7',borderWidth:1,borderColor:'#C9B4FF'},
  claimDisabled:{backgroundColor:'#383146',borderColor:'#665D77'},
  claimText:{color:'#fff',fontSize:9,fontWeight:'900',letterSpacing:1},
  claimHint:{color:C.muted,fontSize:6,marginTop:6},
  welcomeText:{marginBottom:16},
  heading:{color:C.white,fontSize:25,fontWeight:'900',marginTop:5},
  body:{color:C.muted,fontSize:10,marginTop:8,lineHeight:17},
  hero:{padding:17,borderRadius:24,backgroundColor:'#171326',borderWidth:1,borderColor:'rgba(193,163,255,.35)'},
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
  videoCard:{width:'49%',minHeight:170,padding:14,borderRadius:19,justifyContent:'space-between',backgroundColor:'#1B1530',borderWidth:1,borderColor:'rgba(169,139,255,.45)'},
  cardIcon:{color:C.violet,fontSize:28},
  cardTitle:{color:C.white,fontSize:18,fontWeight:'900'},
  cardSub:{color:C.cyan,fontSize:6,letterSpacing:1,marginTop:7},
  cardArrow:{color:C.white,fontSize:20,position:'absolute',right:13,bottom:12},
  sideCards:{flex:1,gap:9},
  smallCard:{flex:1,padding:12,borderRadius:17,justifyContent:'center',backgroundColor:'#13212A',borderWidth:1,borderColor:'rgba(128,232,243,.3)'},
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
  option:{paddingHorizontal:12,paddingVertical:9,borderRadius:20,marginRight:6,marginBottom:7,backgroundColor:'rgba(169,139,255,.12)',borderWidth:1,borderColor:C.line},
  optionText:{color:C.white,fontSize:8,fontWeight:'800'},
  plan:{padding:18,borderRadius:17,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,marginBottom:12},
  planPrice:{color:C.white,fontSize:25,fontWeight:'900',marginVertical:9},
  editorTop:{minHeight:55,flexDirection:'row',alignItems:'center',gap:6,paddingHorizontal:8,borderBottomWidth:1,borderColor:C.line},
  projectName:{color:C.white,fontSize:14,fontWeight:'900',marginTop:3},
  exportTop:{height:37,paddingHorizontal:12,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:'#7655C2',borderWidth:1,borderColor:'#C7B0FF'},
  shortcutTop:{height:35,paddingHorizontal:9,borderRadius:18,alignItems:'center',justifyContent:'center',backgroundColor:C.panel2,borderWidth:1,borderColor:C.line},
  exportTopText:{color:'#fff',fontSize:8,fontWeight:'900'},
  mobileEditor:{flex:1},
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
  timelineBox:{marginHorizontal:8,marginBottom:4},
  timelineHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginHorizontal:3,marginTop:4,marginBottom:5},
  rulerInner:{width:620,flexDirection:'row',justifyContent:'space-between',paddingLeft:92,paddingRight:10,paddingVertical:7,borderBottomWidth:1,borderColor:C.line},
  rulerText:{color:C.muted,fontSize:8},
  track:{height:30,flexDirection:'row',alignItems:'center',marginBottom:3,borderRadius:7,backgroundColor:'rgba(255,255,255,.035)',borderWidth:1,borderColor:'rgba(255,255,255,.07)',overflow:'hidden'},
  trackName:{width:85,color:C.white,fontSize:7,fontWeight:'900',paddingHorizontal:8},
  trackLane:{flex:1,justifyContent:'center',paddingHorizontal:6},
  clip:{height:21,borderRadius:6,justifyContent:'center',paddingHorizontal:7},
  clipText:{color:'#fff',fontSize:6,fontWeight:'900'},
  toolPanel:{marginHorizontal:8,marginTop:5,padding:9,borderRadius:13,backgroundColor:C.panel,borderWidth:1,borderColor:C.line},
  toolPanelHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:7,gap:8},
  toolTitle:{color:C.white,fontSize:11,fontWeight:'900',marginTop:3},
  toolDock:{marginTop:'auto',marginHorizontal:8,marginBottom:4,paddingTop:7,paddingBottom:5,borderRadius:15,backgroundColor:'#12101D',borderWidth:1,borderColor:'rgba(200,180,255,.3)'},
  dockCaption:{color:C.muted,fontSize:6,letterSpacing:1.2,paddingHorizontal:9,paddingBottom:5},
  toolList:{alignItems:'center',paddingHorizontal:4},
  toolItem:{width:61,alignItems:'center',justifyContent:'center'},
  toolCircle:{width:39,height:39,borderRadius:21,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(255,255,255,.055)',borderWidth:1,borderColor:'rgba(205,188,255,.17)'},
  toolCircleActive:{backgroundColor:'rgba(128,232,243,.12)',borderColor:C.cyan},
  toolGlyph:{color:'#B9B2C9',fontSize:17,fontWeight:'800'},
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
  centerWorkspace:{flex:1,minWidth:0},
  desktopPreview:{height:150,flexGrow:0,margin:0,marginBottom:5,minHeight:0},
  desktopCanvas:{height:78,width:'75%',flexGrow:1,minHeight:65,maxHeight:100,marginVertical:3},
  desktopTimeline:{padding:6,borderRadius:12,backgroundColor:'#100E1B',borderWidth:1,borderColor:C.line,maxHeight:180},
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
