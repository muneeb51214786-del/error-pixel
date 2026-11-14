
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  StatusBar, StyleSheet, Modal, Linking, Animated, Easing,
  ActivityIndicator, TextInput, useWindowDimensions, Platform,
  Switch
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const C = {
  bg:'#050817', panel:'#0B142B', panel2:'#101D3A',
  white:'#F5F8FF', muted:'#93A5C7', violet:'#A855F7',
  cyan:'#21E6FF', blue:'#168BFF', pink:'#E34DFF',
  gold:'#FFC94A', green:'#20DDAA', line:'rgba(67,180,255,.25)'
};

const DAILY_REWARD = 3;
const FREE_VIDEO_CREDITS = 3;
const TIKTOK = 'https://www.tiktok.com/@erroreditx99';

const SOCIAL = [
  {name:'TikTok',icon:'♪',color:C.cyan,url:TIKTOK},
  {name:'Instagram',icon:'◎',color:C.pink,url:'https://www.instagram.com/erroreditx99'},
  {name:'YouTube',icon:'▶',color:'#FF555F',url:'https://m.youtube.com/@erroreditx-o2t'},
  {name:'Facebook',icon:'f',color:'#65A8FF',url:'https://www.facebook.com/share/1CF15iyNv6/'}
];

const PLANS = [
  {name:'STANDARD',period:'WEEKLY',price:'Rs. 350',features:['Up to 4K export','Up to 120 FPS','Frame interpolation','Standard creative tools']},
  {name:'PRO',period:'WEEKLY',price:'Rs. 550',features:['Up to 8K export','Up to 240 FPS','AI Ultra Enhance','All premium tools','Ad-free experience']},
  {name:'STANDARD',period:'MONTHLY',price:'Rs. 1,000',features:['Up to 4K export','Up to 120 FPS','Frame interpolation','Standard creative tools']},
  {name:'PRO',period:'MONTHLY',price:'Rs. 1,500',features:['Up to 8K export','Up to 240 FPS','AI Ultra Enhance','All premium tools','Ad-free experience']},
  {name:'STANDARD',period:'YEARLY',price:'Rs. 9,000',features:['Up to 4K export','Up to 120 FPS','Frame interpolation','Standard creative tools']},
  {name:'PRO',period:'YEARLY',price:'Rs. 11,499',features:['Up to 8K export','Up to 240 FPS','AI Ultra Enhance','All premium tools','Ad-free experience']},
  {name:'STANDARD',period:'LIFETIME',price:'Rs. 20,000',features:['Lifetime Standard access','Up to 4K export','Up to 120 FPS','Standard creative tools']}
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
  ['AI Enhance','✦','AI'],['AI Ultra Enhance','✦','AI'],
  ['AI Upscale','⤢','AI'],['AI Stabilize','⌖','AI'],
  ['AI Denoise','⁙','AI'],['Background Remove','◌','AI'],
  ['Object Remove','⌫','AI'],['Frame Interpolation','⏩','AI'],
  ['Optical Flow','⌁','AI'],['AI Captions','▤','AI'],
  ['AI Voice','◉','AI'],['Photo Enhance','✧','Photo'],
  ['Photo Crop','⌗','Photo'],['Background Blur','◌','Photo'],
  ['3D Photo','⬡','Photo'],['Link','↗','Media'],
  ['Export','⇧','Output']
];

const OPTIONS = {
  Import:['Choose video','Choose audio','Choose image','Import folder'],
  Split:['Split at playhead','Split all tracks','Split selected track'],
  Trim:['Trim start','Trim end','Trim both sides'],
  Speed:['0.25×','0.5×','0.75×','1×','1.5×','2×','4×','Speed curve'],
  'Speed Ramp':['Montage','Hero','Bullet time','Custom curve'],
  Crop:['Original','16:9','9:16','1:1','4:5','Custom'],
  Adjust:['Exposure','Contrast','Saturation','Temperature','Tint','Highlights','Shadows','HSL','Curves','Sharpness','Structure'],
  Effects:['Video effects','Light effects','Glow','Glitch','Blur','Distortion'],
  Filters:['Cinema','Vintage','Portrait','Film','Moody','Warm'],
  Audio:['Music','Sound effects','Voiceover','Audio mixer'],
  Text:['Add text','Fonts','Text animation','3D text','Subtitles'],
  'Color Grade':['Basic correction','Color wheels','HSL','Curves','LUT library'],
  'Frame Interpolation':['Frame Blending','Optical Flow','AI Frame Generation'],
  'AI Enhance':['Enhance details','Reduce noise','Improve clarity'],
  'AI Ultra Enhance':['Ultra detail','AI restoration','Advanced clarity'],
  Export:['720p','1080p','2K','4K','8K','24 FPS','30 FPS','60 FPS','90 FPS','120 FPS','144 FPS','160 FPS','180 FPS','200 FPS','240 FPS']
};

const CATEGORIES = ['All','Media','Edit','Motion','Sound','Overlay','Visual','Advanced','3D','AI','Photo','Output'];

function EPLogo({size=52}) {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    const loop = Animated.loop(Animated.timing(spin,{
      toValue:1,duration:5000,easing:Easing.linear,useNativeDriver:true
    }));
    loop.start();
    return ()=>loop.stop();
  },[spin]);
  const rotate = spin.interpolate({inputRange:[0,1],outputRange:['0deg','360deg']});
  return (
    <View style={[s.logo,{width:size,height:size,borderRadius:size/2}]}>
      <Animated.View style={[s.logoRing,{
        width:size*.88,height:size*.88,borderRadius:size,
        transform:[{rotate}]
      }]}/>
      <Text style={{color:'#fff',fontWeight:'900',fontSize:size*.34,
        textShadowColor:C.cyan,textShadowRadius:13}}>EP</Text>
    </View>
  );
}

function GlowButton({children,onPress,style}) {
  return <TouchableOpacity activeOpacity={.8} onPress={onPress} style={[s.glowButton,style]}>{children}</TouchableOpacity>;
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

function ToolButton({item,active,onPress,compact=false}) {
  return (
    <TouchableOpacity style={compact?s.desktopTool:s.toolItem} onPress={onPress}>
      <View style={[s.toolCircle,active&&s.toolCircleActive,compact&&s.desktopToolCircle]}>
        <Text style={[s.toolGlyph,active&&{color:C.cyan}]}>{item[1]}</Text>
      </View>
      <Text style={[s.toolName,active&&{color:C.white},compact&&s.desktopToolName]}>{item[0]}</Text>
    </TouchableOpacity>
  );
}

function PreviewCard({title,sub,icon,color,onPress}) {
  return (
    <TouchableOpacity style={s.featureCard} onPress={onPress}>
      <Text style={[s.featureIcon,{color}]}>{icon}</Text>
      <Text style={s.featureTitle}>{title}</Text>
      <Text style={s.smallMuted}>{sub}</Text>
      <Text style={s.link}>OPEN ↗</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const {width,height} = useWindowDimensions();
  const landscape = width > height;
  const wide = width >= 900;

  const [page,setPage] = useState('welcome');
  const [drawer,setDrawer] = useState(false);
  const [tokens,setTokens] = useState(0);
  const [claimDate,setClaimDate] = useState('');
  const [claimStep,setClaimStep] = useState('idle');
  const [freeCredits,setFreeCredits] = useState(FREE_VIDEO_CREDITS);
  const [tool,setTool] = useState('Selection');
  const [lastAction,setLastAction] = useState('Ready to edit');
  const [clips,setClips] = useState(1);
  const [playing,setPlaying] = useState(false);
  const [fps,setFps] = useState('60 FPS');
  const [resolution,setResolution] = useState('1080p');
  const [modal,setModal] = useState('');
  const [helpQuestion,setHelpQuestion] = useState('');
  const [projectName,setProjectName] = useState('Untitled Project');
  const [trackCount,setTrackCount] = useState(5);
  const [category,setCategory] = useState('All');
  const [projects,setProjects] = useState([]);
  const [keyframeActive,setKeyframeActive] = useState(false);
  const [shortcutPanel,setShortcutPanel] = useState(false);
  const [darkMode,setDarkMode] = useState(true);
  const [notifications,setNotifications] = useState(true);
  const [selectedPlan,setSelectedPlan] = useState(null);

  const historyRef = useRef([]);
  const redoRef = useRef([]);
  const clipboardRef = useRef(null);

  const today = () => new Date().toLocaleDateString('en-CA');

  const saveHistory = useCallback(()=>{
    historyRef.current.push({clips,tool,playing});
    if(historyRef.current.length>40)historyRef.current.shift();
    redoRef.current=[];
  },[clips,tool,playing]);

  const undo = useCallback(()=>{
    const previous=historyRef.current.pop();
    if(!previous){setLastAction('Nothing to undo');return;}
    redoRef.current.push({clips,tool,playing});
    setClips(previous.clips);setTool(previous.tool);setPlaying(previous.playing);
    setLastAction('Undo completed');
  },[clips,tool,playing]);

  const redo = useCallback(()=>{
    const next=redoRef.current.pop();
    if(!next){setLastAction('Nothing to redo');return;}
    historyRef.current.push({clips,tool,playing});
    setClips(next.clips);setTool(next.tool);setPlaying(next.playing);
    setLastAction('Redo completed');
  },[clips,tool,playing]);

  const duplicateClip = ()=>{
    saveHistory();setClips(v=>v+1);setLastAction('Clip duplicated');
  };
  const deleteClip = ()=>{
    if(clips<=0){setLastAction('No clip selected');return;}
    saveHistory();setClips(v=>Math.max(0,v-1));setLastAction('Clip deleted');
  };
  const copyClip = ()=>{clipboardRef.current={clips};setLastAction('Clip copied');};
  const pasteClip = ()=>{
    if(!clipboardRef.current){setLastAction('Nothing copied yet');return;}
    saveHistory();setClips(v=>v+1);setLastAction('Clip pasted');
  };
  const cutClip = ()=>{
    if(clips<=0){setLastAction('No clip selected');return;}
    saveHistory();clipboardRef.current={clips:1};
    setClips(v=>Math.max(0,v-1));setLastAction('Clip cut');
  };

  const chooseTool = name=>{
    saveHistory();setTool(name);setLastAction(name+' selected');
    if(name==='Export')setModal('export');
    if(name==='Split'){setClips(v=>v+1);setLastAction('Split action selected');}
    if(name==='Import')setLastAction('Media picker connection required');
    if(name==='Keyframe')setKeyframeActive(v=>!v);
    if(name==='AI Ultra Enhance')setLastAction('Pro feature — AI engine connection required');
  };

  const chooseOption = option=>{
    saveHistory();setLastAction(option+' selected');
    if(tool==='Export'){
      if(option.includes('FPS'))setFps(option);
      else setResolution(option);
    }
  };

  const runShortcut = useCallback((key,ctrl,shift)=>{
    const k=key.toLowerCase();
    if(ctrl&&k==='c'){copyClip();return true;}
    if(ctrl&&k==='v'){pasteClip();return true;}
    if(ctrl&&k==='x'){cutClip();return true;}
    if(ctrl&&k==='z'){undo();return true;}
    if(ctrl&&k==='y'){redo();return true;}
    if(ctrl&&k==='d'){duplicateClip();return true;}
    if(k===' '||k==='space'){setPlaying(v=>!v);return true;}
    if(k==='delete'||k==='backspace'){deleteClip();return true;}
    if(k==='escape'){setModal('');setDrawer(false);setShortcutPanel(false);return true;}
    return false;
  },[undo,redo]);

  useEffect(()=>{
    if(Platform.OS!=='web')return;
    const handler=e=>{
      const target=e.target;
      const tag=target?.tagName?.toLowerCase();
      if(tag==='input'||tag==='textarea'||target?.isContentEditable)return;
      const handled=runShortcut(e.key,e.ctrlKey||e.metaKey,e.shiftKey);
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
      try{
        const [b,d,p,fc]=await Promise.all([
          AsyncStorage.getItem('ERROR_PIXEL_BALANCE'),
          AsyncStorage.getItem('ERROR_PIXEL_DAILY_CLAIM_DATE'),
          AsyncStorage.getItem('ERROR_PIXEL_PROJECTS'),
          AsyncStorage.getItem('ERROR_PIXEL_FREE_CREDITS')
        ]);
        if(!mounted)return;
        if(b!==null)setTokens(Number(b)||0);
        if(d){setClaimDate(d);if(d===today())setClaimStep('claimed');}
        if(p)setProjects(JSON.parse(p));
        if(fc!==null)setFreeCredits(Number(fc));
      }catch(e){console.log('Storage init:',e);}
    };
    init();
    const timer=setTimeout(()=>{if(mounted)setPage('home');},1800);
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
    setTokens(balance);setClaimDate(date);setClaimStep('claimed');
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
    ['Membership','membership'],['Settings','settings'],['Help Center','help']
  ];

  const visibleTools=category==='All'?TOOLS:TOOLS.filter(x=>x[2]===category);

  const Header=()=>(
    <View style={s.topBar}>
      <View style={s.brandRow}>
        <EPLogo size={48}/>
        <View>
          <Text style={s.brand}>ERROR PIXEL</Text>
          <Text style={s.brandSub}>PRO CREATIVE STUDIO</Text>
        </View>
      </View>
      <View style={s.topActions}>
        <TouchableOpacity style={s.tokenPill} onPress={()=>setPage('membership')}>
          <Text style={s.coinGlyph}>◉</Text>
          <Text style={s.tokenPillText}>{tokens} Tokens</Text>
          <Text style={s.plus}>＋</Text>
        </TouchableOpacity>
        <GlowButton onPress={()=>setPage('settings')}><Text style={s.buttonGlyph}>⚙</Text></GlowButton>
        <GlowButton onPress={()=>setDrawer(true)}><Text style={s.buttonGlyph}>☰</Text></GlowButton>
      </View>
    </View>
  );

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
          <ScrollView nestedScrollEnabled style={{maxHeight:desktop?135:190}}>
            {Array.from({length:trackCount},(_,i)=>({
              name:['VIDEO 01','AUDIO','OVERLAY','EFFECTS','TEXT','VIDEO 02','VOICEOVER','MUSIC','CAPTIONS','GRAPHICS','MASK','ADJUSTMENT'][i],
              color:['#A855F7','#20DDAA','#C34DDF','#168BFF','#6B8FFF','#8064B8','#42A8A0','#BD8C4F','#6289C7','#9E6FA9','#A17A68','#4F9D8B'][i]
            })).map((x,i)=>(
              <View key={x.name} style={s.track}>
                <Text style={s.trackName}>{x.name}</Text>
                <View style={s.trackLane}>
                  <View style={[s.clip,{width:Math.min(150+clips*24,390),backgroundColor:x.color}]}>
                    <Text style={s.clipText}>{i===0?'VIDEO CLIP '+clips:x.name+' LAYER'}</Text>
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
        <TouchableOpacity style={s.bigPlay} onPress={()=>setPlaying(v=>!v)}>
          <Text style={s.bigPlayText}>{playing?'Ⅱ':'▶'}</Text>
        </TouchableOpacity>
      </View>
      <View style={s.previewControls}>
        <View style={s.previewTime}>
          <Text style={s.smallMuted}>00:00:00:00</Text>
          <Text style={s.smallMuted}>00:00:15:00</Text>
        </View>
        <View style={s.controlButtons}>
          <TouchableOpacity style={s.previewControl} onPress={undo}><Text style={s.controlGlyph}>↶</Text><Text style={s.controlLabel}>UNDO</Text></TouchableOpacity>
          <TouchableOpacity style={s.previewControl} onPress={redo}><Text style={s.controlGlyph}>↷</Text><Text style={s.controlLabel}>REDO</Text></TouchableOpacity>
          <TouchableOpacity style={[s.previewControl,keyframeActive&&s.keyframeOn]} onPress={()=>setKeyframeActive(v=>!v)}><Text style={s.controlGlyph}>◇</Text><Text style={s.controlLabel}>KEYFRAME</Text></TouchableOpacity>
          <TouchableOpacity style={[s.previewControl,s.playControl]} onPress={()=>setPlaying(v=>!v)}><Text style={s.controlGlyph}>{playing?'Ⅱ':'▶'}</Text><Text style={s.controlLabel}>{playing?'PAUSE':'PLAY'}</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if(page==='welcome'){
    return (
      <SafeAreaView style={s.safe}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
        <View style={s.welcome}>
          <View style={s.ambient}/>
          <EPLogo size={150}/>
          <Text style={s.welcomeBrand}>ERROR <Text style={{color:C.violet}}>PIXEL</Text></Text>
          <Text style={s.tag}>PROFESSIONAL CREATIVE STUDIO</Text>
          <View style={s.loadingLine}><ActivityIndicator color={C.cyan}/><Text style={s.loadingText}>INITIALIZING CREATIVE STUDIO</Text></View>
          <Text style={s.powered}>POWERED BY MUNEEB HASSAN</Text>
          <Text style={s.channel}>ERROR EDITX99</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>

      {page==='home'&&(
        <View style={s.main}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.homeContent}>
            <Header/>
            <TouchableOpacity style={s.updateBar} onPress={()=>setPage('membership')}>
              <Text style={s.updateIcon}>♧</Text>
              <Text style={s.updateText}>New Update: Premium AI Tools Now Available!</Text>
              <Text style={s.updateLink}>VIEW ↗</Text>
            </TouchableOpacity>

            <View style={s.dashboardGrid}>
              <View style={s.dashboardMain}>
                <View style={s.hero}>
                  <View style={s.heroTop}>
                    <Text style={s.eyebrow}>ERROR PIXEL PRESENTS</Text>
                    <Text style={s.proBadge}>✦ CREATOR STUDIO</Text>
                  </View>
                  <View style={s.heroCenter}>
                    <EPLogo size={82}/>
                    <Text style={s.heroTitle}>MAKE EVERY</Text>
                    <Text style={s.heroAccent}>FRAME COUNT.</Text>
                    <Text style={s.heroCopy}>Professional video editing, photo design and AI creative tools in one workspace.</Text>
                  </View>
                  <TouchableOpacity style={s.newProject} onPress={()=>setPage('editor')}>
                    <Text style={s.newProjectIcon}>＋</Text>
                    <View style={{flex:1,marginLeft:12}}>
                      <Text style={s.newProjectTitle}>CREATE NEW PROJECT</Text>
                      <Text style={s.smallMuted}>Open professional editing workspace</Text>
                    </View>
                    <Text style={s.arrow}>↗</Text>
                  </TouchableOpacity>
                </View>

                <View style={s.sectionRow}>
                  <View><Text style={s.eyebrow}>CHOOSE YOUR WORKSPACE</Text><Text style={s.sectionTitle}>Creative Studio</Text></View>
                  <Text style={s.counter}>01 / 03</Text>
                </View>
                <View style={s.workspaceGrid}>
                  <TouchableOpacity style={s.videoCard} onPress={()=>setPage('editor')}>
                    <Text style={s.cardIcon}>▣</Text>
                    <Text style={s.cardTitle}>VIDEO EDITOR</Text>
                    <Text style={s.cardSub}>EDIT · EFFECTS · EXPORT</Text>
                    <Text style={s.cardArrow}>↗</Text>
                  </TouchableOpacity>
                  <View style={s.sideCards}>
                    <TouchableOpacity style={s.smallCard} onPress={()=>setPage('photo')}>
                      <Text style={s.cardIcon}>◇</Text><Text style={s.smallCardTitle}>PHOTO STUDIO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.smallCard} onPress={()=>{setPage('editor');setTool('AI Enhance');}}>
                      <Text style={[s.cardIcon,{color:C.pink}]}>✦</Text><Text style={s.smallCardTitle}>AI STUDIO</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={s.dashboardSide}>
                <View style={s.tokenCard}>
                  <Text style={s.eyebrow}>ERROR TOKENS</Text>
                  <Text style={s.tokenCount}>{tokens}</Text>
                  <Text style={s.smallMuted}>Daily creator reward · +3</Text>
                  <TouchableOpacity disabled={claimStep==='claimed'} style={[s.claimButton,claimStep==='claimed'&&s.claimDisabled]} onPress={claimStep==='visited'?collectTokens:claimDaily}>
                    <Text style={s.claimText}>{claimStep==='claimed'?'CLAIMED':claimStep==='visited'?'COLLECT':'CLAIM REWARD'}</Text>
                  </TouchableOpacity>
                  <Text style={s.claimHint}>{claimStep==='claimed'?'NEXT CLAIM TOMORROW':'VISIT TIKTOK FIRST'}</Text>
                </View>
                <View style={s.creditCard}>
                  <Text style={s.eyebrow}>FREE VIDEO CREDITS</Text>
                  <Text style={s.creditCount}>{freeCredits} <Text style={s.tokenUnit}>CREDITS</Text></Text>
                  <Text style={s.smallMuted}>Free account starter allowance</Text>
                </View>
                <TouchableOpacity style={s.premiumBanner} onPress={()=>setPage('membership')}>
                  <Text style={s.premiumIcon}>♛</Text>
                  <View style={{flex:1}}><Text style={s.premiumTitle}>GO PREMIUM</Text><Text style={s.smallMuted}>Unlock advanced features</Text></View>
                  <Text style={s.arrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.socialBanner} onPress={()=>openSocial(TIKTOK)}>
                  <Text style={s.socialBannerIcon}>♪</Text>
                  <View><Text style={s.socialBannerTitle}>ERROR EDITX99</Text><Text style={s.smallMuted}>Follow for more</Text></View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.sectionRow}>
              <View><Text style={s.eyebrow}>FEATURE SHOWCASE</Text><Text style={s.sectionTitle}>Explore Features</Text></View>
              <Text style={s.link}>FEATURE PREVIEWS</Text>
            </View>
            <View style={s.featureGrid}>
              <PreviewCard title="AI ENHANCE" sub="Improve video clarity" icon="✦" color={C.violet} onPress={()=>{setPage('editor');setTool('AI Enhance');}}/>
              <PreviewCard title="FPS CONTROL" sub="24 to 240 FPS options" icon="◷" color={C.cyan} onPress={()=>{setPage('editor');setTool('Export');}}/>
              <PreviewCard title="SMART CUTTER" sub="Split and trim clips" icon="✂" color={C.pink} onPress={()=>{setPage('editor');setTool('Split');}}/>
              <PreviewCard title="COLOR STUDIO" sub="Professional color tools" icon="◐" color={C.gold} onPress={()=>{setPage('editor');setTool('Color Grade');}}/>
              <PreviewCard title="MOTION DESIGN" sub="Keyframes and graphs" icon="◇" color={C.blue} onPress={()=>{setPage('editor');setTool('Keyframe');}}/>
              <PreviewCard title="AUDIO STUDIO" sub="Music and sound control" icon="♫" color={C.green} onPress={()=>{setPage('editor');setTool('Audio');}}/>
            </View>

            <View style={s.sectionRow}>
              <View><Text style={s.eyebrow}>YOUR WORKSPACE</Text><Text style={s.sectionTitle}>Recent Projects</Text></View>
              <TouchableOpacity onPress={()=>setPage('projects')}><Text style={s.link}>SEE ALL ↗</Text></TouchableOpacity>
            </View>
            {projects.length===0?(
              <View style={s.emptyCard}><EPLogo size={50}/><Text style={s.emptyTitle}>Your next masterpiece starts here.</Text><Text style={s.smallMuted}>Your saved projects will appear here.</Text></View>
            ):projects.slice(-4).reverse().map((p,i)=>(
              <TouchableOpacity key={i} style={s.projectRow} onPress={()=>setPage('editor')}>
                <EPLogo size={38}/><View style={{flex:1}}><Text style={s.helpTitle}>{p.name}</Text><Text style={s.smallMuted}>{p.date}</Text></View><Text style={s.link}>OPEN ↗</Text>
              </TouchableOpacity>
            ))}

            <View style={s.sectionRow}><View><Text style={s.eyebrow}>CREATOR SOCIAL</Text><Text style={s.sectionTitle}>Follow ERROR EDITX99</Text></View></View>
            <View style={s.socialRow}>{SOCIAL.map(x=><TouchableOpacity key={x.name} style={s.socialCard} onPress={()=>openSocial(x.url)}><Text style={[s.socialIcon,{color:x.color}]}>{x.icon}</Text><Text style={s.smallMuted}>{x.name}</Text></TouchableOpacity>)}</View>
            <View style={s.footer}><Text style={s.brand}>ERROR PIXEL</Text><Text style={s.brandSub}>POWERED BY MUNEEB HASSAN</Text><Text style={s.channel}>ERROR EDITX99</Text></View>
          </ScrollView>
        </View>
      )}

      {page==='editor'&&(
        <View style={s.main}>
          <View style={s.editorTop}>
            <GlowButton onPress={()=>setPage('home')}><Text style={s.buttonGlyph}>‹</Text></GlowButton>
            <View style={{flex:1}}><Text style={s.eyebrow}>ERROR PIXEL / EDITOR</Text><Text style={s.projectName}>{projectName}</Text></View>
            <TouchableOpacity style={s.shortcutTop} onPress={()=>setShortcutPanel(true)}><Text style={s.exportTopText}>⌨ SHORTCUTS</Text></TouchableOpacity>
            <TouchableOpacity style={s.exportTop} onPress={()=>setModal('export')}><Text style={s.exportTopText}>EXPORT ↑</Text></TouchableOpacity>
          </View>

          {landscape?(
            <View style={s.landscapeWorkspace}>
              <View style={[s.leftLibrary,wide&&s.leftLibraryWide]}>
                <Text style={s.eyebrow}>TOOL LIBRARY</Text>
                <View style={s.categoryWrap}>
                  {CATEGORIES.map(x=><TouchableOpacity key={x} onPress={()=>setCategory(x)} style={[s.categoryButton,category===x&&s.categoryActive]}><Text style={[s.categoryText,category===x&&{color:C.cyan}]}>{x}</Text></TouchableOpacity>)}
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={s.desktopToolsGrid}>{visibleTools.map(x=><ToolButton key={x[0]} item={x} active={tool===x[0]} compact onPress={()=>chooseTool(x[0])}/>)}</View>
                </ScrollView>
              </View>
              <View style={s.centerWorkspace}>
                <PreviewMonitor desktop/>
                <View style={s.quickControls}>
                  <TouchableOpacity onPress={undo}><Text style={s.controlGlyph}>↶</Text></TouchableOpacity>
                  <TouchableOpacity onPress={redo}><Text style={s.controlGlyph}>↷</Text></TouchableOpacity>
                  <TouchableOpacity style={s.keyframeButton} onPress={()=>setKeyframeActive(v=>!v)}><Text style={s.optionText}>◇ KEYFRAME</Text></TouchableOpacity>
                  <TouchableOpacity style={s.bigPlayButton} onPress={()=>setPlaying(v=>!v)}><Text style={s.bigPlayText}>{playing?'Ⅱ':'▶'}</Text></TouchableOpacity>
                </View>
                <Timeline desktop/>
                <EditorTools/>
              </View>
              <View style={[s.rightProperties,wide&&s.rightPropertiesWide]}>
                <View style={s.inspectorTabs}><Text style={s.inspectorTab}>✦ Effects</Text><Text style={s.inspectorTab}>☼ Adjust</Text><Text style={s.inspectorTab}>▱ Properties</Text></View>
                <Text style={s.inspectorTitle}>{tool.toUpperCase()}</Text>
                <Text style={s.inspectorLabel}>SELECTED TOOL</Text>
                <Text style={s.inspectorValue}>{tool}</Text>
                <View style={s.inspectorDivider}/>
                <Text style={s.inspectorLabel}>AVAILABLE OPTIONS</Text>
                <ScrollView style={{flex:1}}>
                  {(OPTIONS[tool]||['Position','Scale','Rotation','Opacity','Apply']).map(x=><TouchableOpacity key={x} style={s.inspectorOption} onPress={()=>chooseOption(x)}><Text style={s.optionText}>{x}</Text><Text style={s.link}>›</Text></TouchableOpacity>)}
                </ScrollView>
                <View style={s.inspectorDivider}/>
                <Text style={s.inspectorLabel}>PROJECT SETTINGS</Text>
                <Text style={s.smallMuted}>Resolution: {resolution}</Text>
                <Text style={s.smallMuted}>Frame rate: {fps}</Text>
                <TouchableOpacity style={s.connectButton} onPress={()=>setModal('export')}><Text style={s.claimText}>EXPORT SETTINGS</Text></TouchableOpacity>
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
                  {TOOLS.map(x=><ToolButton key={x[0]} item={x} active={tool===x[0]} onPress={()=>chooseTool(x[0])}/>)}
                </ScrollView>
              </View>
              <Text style={s.engineNote}>VIDEO PROCESSING ENGINE REQUIRED FOR FINAL RENDER</Text>
            </View>
          )}
        </View>
      )}

      {page!=='home'&&page!=='editor'&&(
        <View style={s.main}>
          <View style={s.subHeader}>
            <GlowButton onPress={()=>setPage('home')}><Text style={s.buttonGlyph}>‹</Text></GlowButton>
            <Text style={s.subTitle}>{menu.find(x=>x[1]===page)?.[0]?.toUpperCase()||page.toUpperCase()}</Text>
            <GlowButton onPress={()=>setDrawer(true)}><Text style={s.buttonGlyph}>•••</Text></GlowButton>
          </View>

          {page==='photo'&&<ScrollView contentContainerStyle={s.subContent}>
            <View style={s.photoCanvas}><EPLogo size={80}/><Text style={s.projectName}>PHOTO STUDIO</Text><Text style={s.smallMuted}>Professional visual workspace</Text></View>
            <View style={s.quickGrid}>{['Canvas','Crop','Background Blur','3D Photo','3D Text','Image Shadow','AI Image','Stickers','Filters','Color Grade','Upscale','Remove Background'].map(x=><TouchableOpacity key={x} style={s.option} onPress={()=>setLastAction(x+' selected')}><Text style={s.optionText}>{x}</Text></TouchableOpacity>)}</View>
          </ScrollView>}

          {page==='projects'&&<ScrollView contentContainerStyle={s.subContent}>
            {projects.length===0?<View style={s.emptyCard}><EPLogo size={60}/><Text style={s.emptyTitle}>No saved projects yet</Text><Text style={s.smallMuted}>Create a project to see it here.</Text><TouchableOpacity style={s.connectButton} onPress={()=>setPage('editor')}><Text style={s.claimText}>CREATE PROJECT</Text></TouchableOpacity></View>:projects.map((p,i)=><TouchableOpacity key={i} style={s.projectRow} onPress={()=>setPage('editor')}><EPLogo size={42}/><View style={{flex:1}}><Text style={s.helpTitle}>{p.name}</Text><Text style={s.smallMuted}>{p.date}</Text></View><Text style={s.link}>OPEN ↗</Text></TouchableOpacity>)}
          </ScrollView>}

          {page==='membership'&&<ScrollView contentContainerStyle={s.subContent}>
            <View style={s.membershipIntro}><Text style={s.eyebrow}>UPGRADE YOUR CREATIVE WORKSPACE</Text><Text style={s.sectionTitle}>Choose Your Plan</Text><Text style={s.body}>Select a Standard or Pro membership plan.</Text></View>
            {PLANS.map((p,i)=><View key={i} style={[s.plan, p.name==='PRO'&&s.proPlan]}>
              <View style={s.planTop}><Text style={s.eyebrow}>{p.name} · {p.period}</Text>{p.name==='PRO'&&<Text style={s.proBadge}>✦ PRO</Text>}</View>
              <Text style={s.planPrice}>{p.price}</Text>
              {p.features.map(f=><Text key={f} style={s.planFeature}>✦  {f}</Text>)}
              <TouchableOpacity style={s.connectButton} onPress={()=>{setSelectedPlan(p);setModal('payment');}}><Text style={s.claimText}>SELECT PLAN</Text></TouchableOpacity>
            </View>)}
            <Text style={s.statsNote}>Payments require an approved payment gateway connection. Available methods and international card support depend on provider and merchant eligibility.</Text>
          </ScrollView>}

          {page==='settings'&&<ScrollView contentContainerStyle={s.subContent}>
            <View style={s.settingsCard}>
              <Text style={s.sectionTitle}>App Preferences</Text>
              <View style={s.settingRow}><View><Text style={s.helpTitle}>Dark Interface</Text><Text style={s.smallMuted}>Neon dark studio appearance</Text></View><Switch value={darkMode} onValueChange={setDarkMode} trackColor={{true:C.violet,false:'#555'}} thumbColor={C.white}/></View>
              <View style={s.settingRow}><View><Text style={s.helpTitle}>Notifications</Text><Text style={s.smallMuted}>Studio updates and alerts</Text></View><Switch value={notifications} onValueChange={setNotifications} trackColor={{true:C.violet,false:'#555'}} thumbColor={C.white}/></View>
            </View>
            <View style={s.settingsCard}>
              <Text style={s.sectionTitle}>Account & Workspace</Text>
              <TouchableOpacity style={s.drawerItem} onPress={()=>setPage('membership')}><Text style={s.optionText}>Membership & Billing</Text><Text style={s.link}>›</Text></TouchableOpacity>
              <TouchableOpacity style={s.drawerItem} onPress={()=>setPage('projects')}><Text style={s.optionText}>My Projects</Text><Text style={s.link}>›</Text></TouchableOpacity>
              <TouchableOpacity style={s.drawerItem} onPress={()=>setModal('help')}><Text style={s.optionText}>Help & Support</Text><Text style={s.link}>›</Text></TouchableOpacity>
            </View>
            <View style={s.settingsCard}><Text style={s.eyebrow}>ABOUT</Text><Text style={s.brand}>ERROR PIXEL</Text><Text style={s.smallMuted}>Powered by Muneeb Hassan · ERROR EDITX99</Text></View>
          </ScrollView>}

          {page==='help'&&<View style={s.subContent}><View style={s.emptyCard}><EPLogo size={65}/><Text style={s.emptyTitle}>ERROR PIXEL HELP CENTER</Text><Text style={s.smallMuted}>Choose AI Help to ask a question. Help articles can be added here.</Text><TouchableOpacity style={s.connectButton} onPress={()=>setModal('aihelp')}><Text style={s.claimText}>OPEN AI HELP</Text></TouchableOpacity></View></View>}
        </View>
      )}

      <Modal visible={shortcutPanel} transparent animationType="fade" onRequestClose={()=>setShortcutPanel(false)}>
        <View style={s.modalCenter}><View style={s.dialog}>
          <View style={s.dialogHead}><Text style={s.dialogTitle}>KEYBOARD SHORTCUTS</Text><GlowButton onPress={()=>setShortcutPanel(false)}><Text style={s.buttonGlyph}>×</Text></GlowButton></View>
          {['Ctrl + C  ·  Copy','Ctrl + V  ·  Paste','Ctrl + X  ·  Cut','Ctrl + Z  ·  Undo','Ctrl + Y  ·  Redo','Ctrl + D  ·  Duplicate','Space  ·  Play / Pause','Delete  ·  Delete clip','Esc  ·  Close'].map(x=><Text key={x} style={s.shortcutRow}>{x}</Text>)}
          <Text style={s.statsNote}>Keyboard shortcuts work in the web editor when you are not typing in a text field.</Text>
        </View></View>
      </Modal>

      <Modal visible={drawer} transparent animationType="fade" onRequestClose={()=>setDrawer(false)}>
        <View style={s.modalBackdrop}><TouchableOpacity style={{flex:1}} onPress={()=>setDrawer(false)}/><View style={s.drawer}>
          <View style={s.drawerHead}><EPLogo size={62}/><View><Text style={s.brand}>ERROR PIXEL</Text><Text style={s.brandSub}>PRO CREATIVE STUDIO</Text></View></View>
          {menu.map(x=><TouchableOpacity key={x[1]} style={s.drawerItem} onPress={()=>{setDrawer(false);setPage(x[1]);}}><Text style={s.optionText}>{x[0]}</Text><Text style={s.link}>↗</Text></TouchableOpacity>)}
          <Text style={s.powered}>POWERED BY MUNEEB HASSAN</Text>
        </View></View>
      </Modal>

      <Modal visible={!!modal} transparent animationType="fade" onRequestClose={()=>setModal('')}>
        <View style={s.modalCenter}><View style={s.dialog}>
          <View style={s.dialogHead}><EPLogo size={42}/><View style={{flex:1}}><Text style={s.dialogTitle}>{modal==='export'?'EXPORT SETTINGS':modal==='aihelp'?'ERROR PIXEL AI HELP':modal==='payment'?'MEMBERSHIP PAYMENT':'HELP CENTER'}</Text><Text style={s.brandSub}>ERROR PIXEL STUDIO</Text></View><GlowButton onPress={()=>setModal('')}><Text style={s.buttonGlyph}>×</Text></GlowButton></View>

          {modal==='export'&&<ScrollView style={{maxHeight:430}}>
            <Text style={s.eyebrow}>PROJECT NAME</Text>
            <TextInput value={projectName} onChangeText={setProjectName} placeholder="Project name" placeholderTextColor={C.muted} style={s.nameInput}/>
            <Text style={s.eyebrow}>RESOLUTION</Text>
            <View style={s.choiceRow}>{['720p','1080p','2K','4K','8K'].map(x=><TouchableOpacity key={x} onPress={()=>setResolution(x)} style={[s.choice,resolution===x&&s.choiceActive]}><Text style={s.optionText}>{x}</Text></TouchableOpacity>)}</View>
            <Text style={[s.eyebrow,{marginTop:15}]}>FRAME RATE</Text>
            <View style={s.choiceGrid}>{['24 FPS','30 FPS','60 FPS','90 FPS','120 FPS','144 FPS','160 FPS','180 FPS','200 FPS','240 FPS'].map(x=><TouchableOpacity key={x} onPress={()=>setFps(x)} style={[s.choice,s.choiceHalf,fps===x&&s.choiceActive]}><Text style={s.optionText}>{x}</Text></TouchableOpacity>)}</View>
            <Text style={s.statsNote}>Resolution and frame rate selections are project settings. Actual rendering, frame interpolation and AI processing require a connected video-processing engine and supported source footage.</Text>
            <TouchableOpacity style={s.connectButton} onPress={()=>{setLastAction('Export settings saved: '+resolution+' · '+fps);saveProject();setModal('');}}><Text style={s.claimText}>SAVE PROJECT SETTINGS</Text></TouchableOpacity>
          </ScrollView>}

          {modal==='payment'&&<View>
            <Text style={s.planPrice}>{selectedPlan?.price}</Text>
            <Text style={s.body}>{selectedPlan?.name} {selectedPlan?.period} membership selected.</Text>
            <Text style={s.statsNote}>Payment gateway is not connected yet. No payment will be taken and no membership will be activated from this preview.</Text>
            <TouchableOpacity style={s.connectButton} onPress={()=>setModal('')}><Text style={s.claimText}>CLOSE</Text></TouchableOpacity>
          </View>}

          {modal==='aihelp'&&<View>
            <Text style={s.body}>AI Help requires a secure AI service connection before it can answer questions.</Text>
            <TextInput value={helpQuestion} onChangeText={setHelpQuestion} placeholder="Type your editing question..." placeholderTextColor={C.muted} style={s.nameInput}/>
            <TouchableOpacity style={s.connectButton} onPress={()=>{setLastAction('AI service connection required');setModal('');}}><Text style={s.claimText}>SUBMIT QUESTION</Text></TouchableOpacity>
          </View>}

          {modal==='help'&&<View><Text style={s.body}>Select a tool in the editor to view its available options. Export settings can be opened from the top-right Export button.</Text><TouchableOpacity style={s.connectButton} onPress={()=>setModal('aihelp')}><Text style={s.claimText}>OPEN AI HELP</Text></TouchableOpacity></View>}
        </View></View>
      </Modal>
    </SafeAreaView>
  );
}

const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg},main:{flex:1,backgroundColor:C.bg},
  welcome:{flex:1,alignItems:'center',justifyContent:'center',padding:28,backgroundColor:C.bg},
  ambient:{position:'absolute',width:320,height:320,borderRadius:160,backgroundColor:'rgba(40,90,220,.15)'},
  logo:{alignItems:'center',justifyContent:'center',backgroundColor:'#101A3A',borderWidth:2,borderColor:C.violet,shadowColor:C.cyan,shadowOpacity:.8,shadowRadius:17,elevation:12,overflow:'hidden'},
  logoRing:{position:'absolute',borderWidth:2,borderColor:C.cyan,borderTopColor:C.pink},
  welcomeBrand:{color:C.white,fontSize:31,fontWeight:'900',letterSpacing:2,marginTop:28},
  tag:{color:C.cyan,fontSize:8,letterSpacing:2.4,marginTop:10},
  loadingLine:{flexDirection:'row',alignItems:'center',gap:9,marginTop:42},
  loadingText:{color:C.cyan,fontSize:8,letterSpacing:1.4},
  powered:{color:C.muted,fontSize:8,letterSpacing:1.5,marginTop:24},
  channel:{color:C.violet,fontSize:10,fontWeight:'900',letterSpacing:2,marginTop:8},
  homeContent:{padding:15,paddingBottom:45},
  topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:13},
  topActions:{flexDirection:'row',gap:7,alignItems:'center'},
  brandRow:{flexDirection:'row',alignItems:'center',gap:10},
  brand:{color:C.white,fontSize:16,fontWeight:'900',letterSpacing:1.2},
  brandSub:{color:C.cyan,fontSize:6,letterSpacing:1.4,marginTop:4},
  glowButton:{width:40,height:40,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:'#101C3A',borderWidth:1,borderColor:'rgba(33,230,255,.5)',shadowColor:C.violet,shadowOpacity:.35,shadowRadius:8},
  buttonGlyph:{color:C.white,fontSize:17,fontWeight:'800'},
  tokenPill:{height:38,flexDirection:'row',alignItems:'center',gap:6,paddingHorizontal:10,borderRadius:22,backgroundColor:'#13254B',borderWidth:1,borderColor:C.gold},
  coinGlyph:{color:C.gold,fontSize:17},tokenPillText:{color:C.white,fontSize:9,fontWeight:'900'},plus:{color:C.cyan,fontSize:18,fontWeight:'900'},
  updateBar:{minHeight:43,flexDirection:'row',alignItems:'center',gap:9,padding:10,marginBottom:14,borderRadius:25,backgroundColor:'#111C3A',borderWidth:1,borderColor:C.violet},
  updateIcon:{color:C.cyan,fontSize:19},updateText:{color:C.white,fontSize:9,fontWeight:'800',flex:1},updateLink:{color:C.cyan,fontSize:8,fontWeight:'900'},
  dashboardGrid:{flexDirection:'row',gap:12},
  dashboardMain:{flex:2,minWidth:0},dashboardSide:{flex:1,minWidth:125,gap:10},
  hero:{padding:17,borderRadius:22,backgroundColor:'#101A38',borderWidth:1,borderColor:C.violet,shadowColor:C.blue,shadowOpacity:.3,shadowRadius:12},
  heroTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  eyebrow:{color:C.cyan,fontSize:7,letterSpacing:1.4,fontWeight:'900'},
  proBadge:{color:C.gold,fontSize:7,borderWidth:1,borderColor:'rgba(255,201,74,.5)',borderRadius:20,padding:7,overflow:'hidden'},
  heroCenter:{alignItems:'center',paddingVertical:16},
  heroTitle:{color:C.white,fontSize:22,fontWeight:'900',letterSpacing:1.5,marginTop:12},
  heroAccent:{color:C.violet,fontSize:24,fontWeight:'900',letterSpacing:2},
  heroCopy:{color:C.muted,fontSize:9,textAlign:'center',lineHeight:15,maxWidth:270,marginTop:9},
  newProject:{flexDirection:'row',alignItems:'center',padding:10,borderRadius:25,backgroundColor:'rgba(33,230,255,.07)',borderWidth:1,borderColor:C.cyan},
  newProjectIcon:{color:C.cyan,fontSize:24},newProjectTitle:{color:C.white,fontSize:9,fontWeight:'900',letterSpacing:.8},
  smallMuted:{color:C.muted,fontSize:8,marginTop:5},arrow:{color:C.cyan,fontSize:20},
  sectionRow:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',marginTop:23,marginBottom:11},
  sectionTitle:{color:C.white,fontSize:18,fontWeight:'900',marginTop:5},counter:{color:C.muted,fontSize:8},
  workspaceGrid:{flexDirection:'row',gap:9},
  videoCard:{flex:1,minHeight:135,padding:13,borderRadius:18,justifyContent:'space-between',backgroundColor:'#111D42',borderWidth:1,borderColor:C.cyan},
  cardIcon:{color:C.cyan,fontSize:26},cardTitle:{color:C.white,fontSize:17,fontWeight:'900'},
  cardSub:{color:C.cyan,fontSize:6,letterSpacing:1,marginTop:7},cardArrow:{color:C.white,fontSize:20,position:'absolute',right:13,bottom:12},
  sideCards:{flex:1,gap:9},smallCard:{flex:1,padding:11,borderRadius:16,justifyContent:'center',backgroundColor:'#101D3A',borderWidth:1,borderColor:C.violet},
  smallCardTitle:{color:C.white,fontSize:9,fontWeight:'900',marginTop:6},
  tokenCard:{padding:13,borderRadius:17,backgroundColor:'#17152C',borderWidth:1,borderColor:C.gold},
  tokenCount:{color:C.gold,fontSize:28,fontWeight:'900',marginTop:6},tokenUnit:{color:C.violet,fontSize:8},
  claimButton:{minHeight:35,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:'#7353D4',borderWidth:1,borderColor:C.violet,marginTop:10},
  claimDisabled:{backgroundColor:'#343044',borderColor:'#665D77'},claimText:{color:'#fff',fontSize:9,fontWeight:'900',letterSpacing:1},
  claimHint:{color:C.muted,fontSize:6,marginTop:6,textAlign:'center'},
  creditCard:{padding:13,borderRadius:16,backgroundColor:'#101C3B',borderWidth:1,borderColor:C.cyan},
  creditCount:{color:C.white,fontSize:23,fontWeight:'900',marginTop:5},
  premiumBanner:{flexDirection:'row',alignItems:'center',padding:11,borderRadius:15,backgroundColor:'#302343',borderWidth:1,borderColor:C.gold},
  premiumIcon:{color:C.gold,fontSize:25,marginRight:9},premiumTitle:{color:C.gold,fontSize:10,fontWeight:'900'},
  socialBanner:{flexDirection:'row',alignItems:'center',gap:10,padding:11,borderRadius:15,backgroundColor:'#1D1237',borderWidth:1,borderColor:C.violet},
  socialBannerIcon:{color:C.cyan,fontSize:28},socialBannerTitle:{color:C.white,fontSize:10,fontWeight:'900'},
  featureGrid:{flexDirection:'row',flexWrap:'wrap',gap:9},
  featureCard:{width:'31.5%',minWidth:95,padding:12,borderRadius:15,backgroundColor:C.panel,borderWidth:1,borderColor:C.line},
  featureIcon:{fontSize:27},featureTitle:{color:C.white,fontSize:9,fontWeight:'900',marginTop:7},
  link:{color:C.cyan,fontSize:8,fontWeight:'900',letterSpacing:.7,marginTop:7},
  emptyCard:{alignItems:'center',padding:22,borderRadius:19,backgroundColor:C.panel,borderWidth:1,borderColor:C.line},
  emptyTitle:{color:C.white,fontSize:11,fontWeight:'800',marginTop:12},
  projectRow:{flexDirection:'row',alignItems:'center',gap:12,padding:13,marginBottom:9,borderRadius:15,backgroundColor:C.panel,borderWidth:1,borderColor:C.line},
  helpTitle:{color:C.white,fontSize:9,fontWeight:'900',marginTop:4},
  socialRow:{flexDirection:'row',gap:9},socialCard:{flex:1,alignItems:'center',padding:13,borderRadius:13,backgroundColor:C.panel,borderWidth:1,borderColor:C.line},
  socialIcon:{fontSize:21,fontWeight:'900'},footer:{alignItems:'center',paddingVertical:27},
  socialDock:{position:'absolute',right:7,top:'34%',alignItems:'center',gap:10,padding:7,borderRadius:28,backgroundColor:'rgba(8,12,30,.96)',borderWidth:1,borderColor:C.violet,elevation:12},
  socialButton:{width:42,height:42,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(169,139,255,.18)',borderWidth:1,borderColor:C.line},
  subHeader:{height:58,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:14,borderBottomWidth:1,borderColor:C.line},
  subTitle:{color:C.white,fontSize:11,fontWeight:'900',letterSpacing:1.4},subContent:{padding:17},
  photoCanvas:{height:240,alignItems:'center',justifyContent:'center',gap:10,borderRadius:18,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,marginBottom:16},
  quickGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},
  option:{paddingHorizontal:12,paddingVertical:9,borderRadius:20,marginRight:6,marginBottom:7,backgroundColor:'rgba(169,139,255,.12)',borderWidth:1,borderColor:C.line},
  optionText:{color:C.white,fontSize:8,fontWeight:'800'},
  plan:{padding:17,borderRadius:17,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,marginBottom:12},
  proPlan:{borderColor:C.violet,backgroundColor:'#17142D'},planTop:{flexDirection:'row',justifyContent:'space-between'},
  planPrice:{color:C.white,fontSize:25,fontWeight:'900',marginVertical:9},planFeature:{color:C.muted,fontSize:9,marginTop:7},
  membershipIntro:{marginBottom:16},body:{color:C.muted,fontSize:10,marginTop:8,lineHeight:17},
  settingsCard:{padding:16,borderRadius:17,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,marginBottom:13},
  settingRow:{minHeight:60,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderColor:C.line},
  drawerItem:{height:49,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderColor:'rgba(255,255,255,.07)'},
  editorTop:{minHeight:55,flexDirection:'row',alignItems:'center',gap:6,paddingHorizontal:8,borderBottomWidth:1,borderColor:C.line},
  projectName:{color:C.white,fontSize:14,fontWeight:'900',marginTop:3},
  exportTop:{height:37,paddingHorizontal:12,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:'#7655C2',borderWidth:1,borderColor:C.violet},
  shortcutTop:{height:35,paddingHorizontal:9,borderRadius:18,alignItems:'center',justifyContent:'center',backgroundColor:C.panel2,borderWidth:1,borderColor:C.line},
  exportTopText:{color:'#fff',fontSize:8,fontWeight:'900'},mobileEditor:{flex:1},
  preview:{margin:9,padding:8,borderRadius:15,backgroundColor:'#080F25',borderWidth:1,borderColor:C.violet},
  previewMeta:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  previewCanvas:{height:130,width:'82%',alignSelf:'center',alignItems:'center',justifyContent:'center',marginVertical:5,borderRadius:8,backgroundColor:'#101D42',borderWidth:1,borderColor:C.cyan},
  previewBrand:{color:C.white,fontSize:11,fontWeight:'900',letterSpacing:2,marginTop:4},
  bigPlay:{position:'absolute',width:43,height:43,borderRadius:25,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,.6)',borderWidth:1,borderColor:C.cyan},
  bigPlayText:{color:C.white,fontSize:21},previewControls:{marginTop:3,paddingTop:5,borderTopWidth:1,borderColor:C.line},
  previewTime:{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:5,marginBottom:5},
  controlButtons:{flexDirection:'row',justifyContent:'space-around',alignItems:'center'},
  previewControl:{minWidth:55,alignItems:'center',justifyContent:'center',paddingHorizontal:7,paddingVertical:5,borderRadius:9,backgroundColor:'rgba(169,139,255,.12)',borderWidth:1,borderColor:C.line},
  playControl:{backgroundColor:'rgba(128,232,243,.14)',borderColor:C.cyan},
  keyframeOn:{backgroundColor:'rgba(233,211,159,.16)',borderColor:C.gold},
  controlGlyph:{color:C.white,fontSize:20,fontWeight:'900'},controlLabel:{color:C.muted,fontSize:6,fontWeight:'900',marginTop:2},
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
  toolDock:{marginTop:'auto',marginHorizontal:8,marginBottom:4,paddingTop:7,paddingBottom:5,borderRadius:15,backgroundColor:'#10172E',borderWidth:1,borderColor:C.violet},
  dockCaption:{color:C.muted,fontSize:6,letterSpacing:1.2,paddingHorizontal:9,paddingBottom:5},
  toolList:{alignItems:'center',paddingHorizontal:4},toolItem:{width:61,alignItems:'center',justifyContent:'center'},
  toolCircle:{width:39,height:39,borderRadius:21,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(255,255,255,.055)',borderWidth:1,borderColor:C.line},
  toolCircleActive:{backgroundColor:'rgba(128,232,243,.12)',borderColor:C.cyan},
  toolGlyph:{color:'#B9C6DF',fontSize:17,fontWeight:'800'},toolName:{color:C.muted,fontSize:6,fontWeight:'800',marginTop:4},
  engineNote:{color:C.muted,fontSize:6,textAlign:'center',paddingVertical:4},
  landscapeWorkspace:{flex:1,flexDirection:'row',padding:7,gap:7},
  leftLibrary:{width:150,padding:9,borderRadius:12,backgroundColor:'#080F23',borderWidth:1,borderColor:C.line},
  leftLibraryWide:{width:190},categoryWrap:{flexDirection:'row',flexWrap:'wrap',gap:4,marginTop:9,marginBottom:8},
  categoryButton:{paddingHorizontal:8,paddingVertical:6,borderRadius:12,backgroundColor:C.panel2,borderWidth:1,borderColor:C.line},
  categoryActive:{borderColor:C.cyan,backgroundColor:'rgba(128,232,243,.10)'},
  categoryText:{color:C.muted,fontSize:8,fontWeight:'800'},
  desktopToolsGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},
  desktopTool:{width:'31%',alignItems:'center',marginBottom:10},
  desktopToolCircle:{width:35,height:35},desktopToolName:{fontSize:6,textAlign:'center'},
  centerWorkspace:{flex:1,minWidth:0},desktopPreview:{height:150,flexGrow:0,margin:0,marginBottom:5,minHeight:0},
  desktopCanvas:{height:78,width:'75%',flexGrow:1,minHeight:65,maxHeight:100,marginVertical:3},
  quickControls:{height:48,flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',marginBottom:5,borderRadius:12,backgroundColor:C.panel,borderWidth:1,borderColor:C.cyan},
  keyframeButton:{padding:8,borderRadius:12,backgroundColor:C.panel2,borderWidth:1,borderColor:C.violet},
  bigPlayButton:{width:40,height:40,borderRadius:25,alignItems:'center',justifyContent:'center',backgroundColor:'#132A55',borderWidth:2,borderColor:C.cyan},
  desktopTimeline:{padding:6,borderRadius:12,backgroundColor:'#080F23',borderWidth:1,borderColor:C.cyan,maxHeight:180},
  rightProperties:{width:150,padding:9,borderRadius:12,backgroundColor:'#0B1230',borderWidth:1,borderColor:C.violet},
  rightPropertiesWide:{width:205},inspectorTabs:{flexDirection:'row',justifyContent:'space-between',paddingBottom:9,borderBottomWidth:1,borderColor:C.line},
  inspectorTab:{color:C.cyan,fontSize:7,fontWeight:'900'},inspectorTitle:{color:C.white,fontSize:14,fontWeight:'900',marginTop:10},
  inspectorLabel:{color:C.cyan,fontSize:7,fontWeight:'900',letterSpacing:1,marginTop:15},
  inspectorValue:{color:C.white,fontSize:10,marginTop:6},inspectorDivider:{height:1,backgroundColor:C.line,marginVertical:10},
  inspectorOption:{minHeight:31,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderColor:'rgba(255,255,255,.06)'},
  connectButton:{height:40,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:'#4B3B9D',marginTop:13,borderWidth:1,borderColor:C.violet},
  modalBackdrop:{flex:1,flexDirection:'row',backgroundColor:'rgba(0,0,0,.72)'},
  drawer:{width:'82%',maxWidth:360,padding:20,paddingTop:45,backgroundColor:'#080F23',borderRightWidth:1,borderColor:C.line},
  drawerHead:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:28},
  modalCenter:{flex:1,justifyContent:'center',alignItems:'center',padding:20,backgroundColor:'rgba(0,0,0,.78)'},
  dialog:{width:'100%',maxWidth:440,padding:17,borderRadius:20,backgroundColor:'#101A38',borderWidth:1,borderColor:C.violet},
  dialogHead:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:18},
  dialogTitle:{color:C.white,fontSize:12,fontWeight:'900',letterSpacing:1},
  choiceRow:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:9},
  choiceGrid:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:9},
  choice:{paddingHorizontal:13,paddingVertical:10,borderRadius:20,backgroundColor:C.panel2,borderWidth:1,borderColor:C.line},
  choiceHalf:{width:'22%',alignItems:'center',paddingHorizontal:2},
  choiceActive:{backgroundColor:'rgba(128,232,243,.17)',borderColor:C.cyan},
  nameInput:{color:C.white,fontSize:11,padding:12,marginTop:8,marginBottom:15,borderRadius:10,backgroundColor:C.panel,borderWidth:1,borderColor:C.line},
  statsNote:{color:C.muted,fontSize:8,lineHeight:14,marginTop:11},
  shortcutRow:{minHeight:35,color:C.cyan,fontSize:9,fontWeight:'900',paddingVertical:8,borderBottomWidth:1,borderColor:C.line}
});
