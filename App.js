import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, ScrollView, Pressable, Image,
  Alert, StatusBar, ActivityIndicator, Switch, Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useVideoPlayer, VideoView } from 'expo-video';
import AsyncStorage from '@react-native-async-storage/async-storage';

const C = { bg:'#070A11', panel:'#101722', panel2:'#151F2D', line:'#273548', cyan:'#32D9F5', blue:'#168DBB', purple:'#B56BFF', text:'#F3F7FF', muted:'#8C9AAF', green:'#37D6B0', warn:'#FFCB70' };
const FPS = [...Array.from({length:217},(_,i)=>i+24),300,360,480,600,720,960];
const QUALITIES = [{label:'144p',w:256,h:144},{label:'240p',w:426,h:240},{label:'360p',w:640,h:360},{label:'480p',w:854,h:480},{label:'540p',w:960,h:540},{label:'720p',w:1280,h:720},{label:'1080p',w:1920,h:1080},{label:'1440p',w:2560,h:1440},{label:'2K',w:2560,h:1440},{label:'4K',w:3840,h:2160},{label:'5K',w:5120,h:2880},{label:'6K',w:6144,h:3456},{label:'8K',w:7680,h:4320},{label:'12K',w:11520,h:6480},{label:'16K',w:15360,h:8640}];
const fpsLabel = n => n >= 300 ? n+' FPS+' : n+' FPS';
function Pill({label,active,onPress,small=false}) { return <Pressable onPress={onPress} style={[styles.pill,small&&styles.smallPill,active&&styles.pillActive]}><Text style={[styles.pillText,active&&styles.pillTextActive]}>{label}</Text></Pressable>; }
function Section({title,subtitle,children}) { return <View style={styles.section}><View style={styles.sectionHead}><Text style={styles.sectionTitle}>{title}</Text>{subtitle?<Text style={styles.sectionSub}>{subtitle}</Text>:null}</View>{children}</View>; }
function Logo({large=false}) { return <View style={[styles.logoWrap,large&&styles.logoLarge]}><View style={styles.logoDiamond}><Text style={styles.logoLetters}>EE</Text></View></View>; }

export default function App() {
  const [tab,setTab]=useState('Home');
  const [videoUri,setVideoUri]=useState(null);
  const [videoName,setVideoName]=useState('');
  const [fps,setFps]=useState(60);
  const [quality,setQuality]=useState('1080p');
  const [ultra,setUltra]=useState(true);
  const [interpolation,setInterpolation]=useState(true);
  const [denoise,setDenoise]=useState(true);
  const [sharpen,setSharpen]=useState(true);
  const [stabilize,setStabilize]=useState(false);
  const [engineBusy,setEngineBusy]=useState(false);
  const [recent,setRecent]=useState([]);
  const [fpsSearch,setFpsSearch]=useState(false);
  const [qualityIndex,setQualityIndex]=useState(6);
  const player=useVideoPlayer(null,p=>{p.loop=true;});
  useEffect(()=>{ if(videoUri){ try{ player.replaceAsync(videoUri); }catch(e){} } },[videoUri,player]);
  useEffect(()=>{ AsyncStorage.getItem('enhance-error-recent').then(v=>{if(v)setRecent(JSON.parse(v));}).catch(()=>{}); },[]);
  const selectedQuality=useMemo(()=>QUALITIES.find(q=>q.label===quality)||QUALITIES[6],[quality]);
  const pickVideo=async()=>{
    const perm=await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(!perm.granted){Alert.alert('Permission required','Allow media access to select a video.');return;}
    const result=await ImagePicker.launchImageLibraryAsync({mediaTypes:['videos'],quality:1,allowsEditing:false});
    if(result.canceled||!result.assets?.[0])return;
    const a=result.assets[0]; setVideoUri(a.uri);setVideoName(a.fileName||'Selected video');
    const item={name:a.fileName||'Selected video',uri:a.uri,date:Date.now()};
    const next=[item,...recent.filter(x=>x.uri!==a.uri)].slice(0,8);setRecent(next);
    AsyncStorage.setItem('enhance-error-recent',JSON.stringify(next)).catch(()=>{});
    setTab('Enhance');
  };
  const startEnhancement=()=>{
    if(!videoUri){Alert.alert('Select a video','Choose a video first to preview enhancement settings.');return;}
    Alert.alert('AI processing engine not connected','Your video is loaded and settings are selectable, but real RIFE frame interpolation and AI super-resolution need a licensed/hosted inference engine. This build will not pretend that changing FPS or resolution has processed your video.');
  };
  const reset=()=>{setFps(60);setQuality('1080p');setQualityIndex(6);setUltra(true);setInterpolation(true);setDenoise(true);setSharpen(true);setStabilize(false);};
  const Home=()=> <ScrollView contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
    <View style={styles.brand}><Logo large/><Text style={styles.brandName}>ENHANCE <Text style={{color:C.cyan}}>ERROR</Text></Text><Text style={styles.brandSub}>AI VIDEO ENHANCEMENT STUDIO</Text></View>
    <View style={styles.homeTitleRow}><View><Text style={styles.h1}>Your Studio</Text><Text style={styles.muted}>Restore detail. Create smoother motion.</Text></View><Pressable style={styles.newButton} onPress={pickVideo}><Text style={styles.newButtonText}>＋ New Video</Text></Pressable></View>
    <View style={styles.featureGrid}>
      <Feature icon="✧" title="AI Ultra Enhance" sub="Detail recovery & denoise" color={C.cyan} onPress={()=>setTab('Enhance')}/>
      <Feature icon="◷" title="Frame Interpolation" sub="24–960 FPS targets" color={C.green} onPress={()=>setTab('Enhance')}/>
      <Feature icon="◇" title="Quality Upscaler" sub="144p to 16K targets" color={C.purple} onPress={()=>setTab('Enhance')}/>
      <Feature icon="⌁" title="Stabilization" sub="Motion correction controls" color={C.cyan} onPress={()=>setTab('Enhance')}/>
    </View>
    <Section title="RECENT PROJECTS" subtitle="On this device">
      {recent.length===0?<Pressable onPress={pickVideo} style={styles.emptyCard}><Text style={styles.emptyIcon}>▣</Text><Text style={styles.cardTitle}>Start your first enhancement</Text><Text style={styles.muted}>Import a video to open the enhancement studio</Text></Pressable>:recent.map((r,i)=><Pressable key={r.uri+i} style={styles.recentRow} onPress={()=>{setVideoUri(r.uri);setVideoName(r.name);setTab('Enhance');}}><View style={styles.recentThumb}><Text style={{color:C.cyan,fontSize:22}}>▶</Text></View><View style={{flex:1}}><Text style={styles.cardTitle} numberOfLines={1}>{r.name}</Text><Text style={styles.muted}>Tap to continue · Local media</Text></View><Text style={{color:C.cyan}}>OPEN ›</Text></Pressable>)}
    </Section>
    <View style={styles.note}><Text style={styles.noteTitle}>ENGINE STATUS</Text><Text style={styles.noteText}>Preview and project controls are available. AI rendering engines are not yet installed or connected in this build.</Text></View>
  </ScrollView>;
  const Feature=({icon,title,sub,color,onPress})=><Pressable onPress={onPress} style={styles.feature}><Text style={[styles.featureIcon,{color}]}>{icon}</Text><Text style={styles.featureTitle}>{title}</Text><Text style={styles.featureSub}>{sub}</Text></Pressable>;
  const Enhance=()=> <ScrollView contentContainerStyle={styles.editorContent} showsVerticalScrollIndicator={false}>
    <View style={styles.editorTop}><View><Text style={styles.h1}>Enhancement Studio</Text><Text style={styles.muted}>Non-destructive settings preview</Text></View><Pressable onPress={pickVideo} style={styles.importButton}><Text style={styles.importText}>＋ Import</Text></Pressable></View>
    <View style={styles.previewCard}>
      {videoUri?<VideoView player={player} style={styles.video} nativeControls contentFit="contain"/>:<Pressable style={styles.emptyPreview} onPress={pickVideo}><Text style={styles.playIcon}>▶</Text><Text style={styles.cardTitle}>Import video to preview</Text><Text style={styles.muted}>MP4 · MOV · supported gallery videos</Text></Pressable>}
      <View style={styles.previewFooter}><Text numberOfLines={1} style={styles.previewName}>{videoName||'No video selected'}</Text><Text style={styles.previewTag}>{quality}</Text></View>
    </View>
    <Section title="FRAME RATE" subtitle="Target output FPS — actual interpolation requires an AI engine">
      <View style={styles.valueLine}><Text style={styles.muted}>Selected output</Text><Text style={styles.value}>{fpsLabel(fps)}</Text></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ruler}>
        {FPS.map(n=><Pressable key={n} onPress={()=>setFps(n)} style={[styles.fpsTick,fps===n&&styles.fpsTickActive]}><Text style={[styles.fpsTickText,fps===n&&styles.fpsTickTextActive]}>{n}</Text></Pressable>)}
      </ScrollView>
      <Text style={styles.helper}>24–240 FPS in 1 FPS steps, plus higher experimental targets. Hardware and source frame rate determine what can really be rendered.</Text>
    </Section>
    <Section title="OUTPUT RESOLUTION" subtitle="Choose target size — upscaling requires a real super-resolution model">
      <View style={styles.valueLine}><Text style={styles.muted}>Target resolution</Text><Text style={styles.value}>{quality}</Text></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.qualityRuler}>
        {QUALITIES.map((q,i)=><Pressable key={q.label} onPress={()=>{setQuality(q.label);setQualityIndex(i);}} style={[styles.qualityChip,quality===q.label&&styles.qualityActive]}><Text style={[styles.qualityText,quality===q.label&&styles.qualityTextActive]}>{q.label}</Text><Text style={styles.qualityPixels}>{q.w}×{q.h}</Text></Pressable>)}
      </ScrollView>
      <Text style={styles.helper}>16K is a selectable target only. Large outputs need substantial memory, storage and compatible processing hardware.</Text>
    </Section>
    <Section title="AI ENHANCEMENT" subtitle="Enable desired processing stages">
      <Toggle title="AI Ultra Enhancement" sub="AI detail reconstruction" value={ultra} onChange={setUltra}/>
      <Toggle title="Frame Interpolation" sub="Generate intermediate frames" value={interpolation} onChange={setInterpolation}/>
      <Toggle title="Denoise" sub="Reduce compression and sensor noise" value={denoise} onChange={setDenoise}/>
      <Toggle title="Detail Sharpening" sub="Controlled edge enhancement" value={sharpen} onChange={setSharpen}/>
      <Toggle title="Video Stabilization" sub="Reduce unwanted camera movement" value={stabilize} onChange={setStabilize}/>
    </Section>
    <Section title="PROCESSING ENGINES" subtitle="Integration status">
      <Engine name="RIFE Frame Interpolation" detail="Open-source model · inference runtime required" status="Not installed"/>
      <Engine name="Real-ESRGAN Super Resolution" detail="Open-source model · GPU/NPU runtime required" status="Not installed"/>
      <Engine name="Topaz Video AI" detail="Commercial proprietary software · separate licence required" status="Not licensed"/>
      <Engine name="FFmpeg Media Pipeline" detail="Media decode/encode backend" status="Not connected"/>
    </Section>
    <View style={styles.actionRow}><Pressable style={styles.resetButton} onPress={reset}><Text style={styles.resetText}>RESET</Text></Pressable><Pressable style={styles.exportButton} onPress={startEnhancement}><Text style={styles.exportText}>START AI ENHANCEMENT  →</Text></Pressable></View>
  </ScrollView>;
  const Toggle=({title,sub,value,onChange})=><View style={styles.toggleRow}><View style={{flex:1}}><Text style={styles.toggleTitle}>{title}</Text><Text style={styles.toggleSub}>{sub}</Text></View><Switch value={value} onValueChange={onChange} trackColor={{false:'#354154',true:'#167F9D'}} thumbColor={value?C.cyan:'#B5C0CF'}/></View>;
  const Engine=({name,detail,status})=><View style={styles.engineRow}><View style={{flex:1}}><Text style={styles.engineName}>{name}</Text><Text style={styles.engineDetail}>{detail}</Text></View><Text style={styles.engineStatus}>{status}</Text></View>;
  const Projects=()=> <ScrollView contentContainerStyle={styles.homeContent}><Text style={styles.h1}>Projects</Text><Text style={styles.muted}>Recent videos stored on this device</Text>{recent.length?recent.map((r,i)=><Pressable key={r.uri+i} style={styles.recentRow} onPress={()=>{setVideoUri(r.uri);setVideoName(r.name);setTab('Enhance');}}><View style={styles.recentThumb}><Text style={{color:C.cyan}}>▶</Text></View><Text style={{color:C.text,flex:1}}>{r.name}</Text><Text style={{color:C.cyan}}>EDIT</Text></Pressable>):<View style={styles.emptyCard}><Text style={styles.muted}>No projects yet. Import a video to begin.</Text></View>}<Pressable style={styles.newButton} onPress={pickVideo}><Text style={styles.newButtonText}>＋ Import Video</Text></Pressable></ScrollView>;
  const Settings=()=> <ScrollView contentContainerStyle={styles.homeContent}><Text style={styles.h1}>Settings</Text><View style={styles.engineRow}><Text style={styles.engineName}>App</Text><Text style={styles.engineStatus}>Enhance Error 1.0.0</Text></View><View style={styles.engineRow}><Text style={styles.engineName}>Theme</Text><Text style={styles.engineStatus}>Dark · Neon cyan / violet</Text></View><View style={styles.engineRow}><Text style={styles.engineName}>AI processing</Text><Text style={styles.engineStatus}>Backend not connected</Text></View><Text style={styles.helper}>No AI operation will be reported as completed until the processing backend returns a verified output file.</Text></ScrollView>;
  const content=tab==='Home'?<Home/>:tab==='Enhance'?<Enhance/>:tab==='Projects'?<Projects/>:<Settings/>;
  return <SafeAreaView style={styles.safe}><StatusBar barStyle="light-content" backgroundColor={C.bg}/><View style={styles.header}><View style={styles.headerBrand}><Logo/><View><Text style={styles.headerTitle}>ENHANCE <Text style={{color:C.cyan}}>ERROR</Text></Text><Text style={styles.headerSub}>VIDEO AI STUDIO</Text></View></View><Pressable onPress={pickVideo} style={styles.headerImport}><Text style={{color:C.cyan,fontSize:20}}>＋</Text></Pressable></View><View style={styles.body}>{content}</View><View style={styles.nav}>{[['Home','⌂'],['Projects','▣'],['Enhance','✧'],['Settings','⚙']].map(([name,icon])=><Pressable key={name} onPress={()=>setTab(name)} style={styles.navItem}><Text style={[styles.navIcon,tab===name&&styles.navActive]}>{icon}</Text><Text style={[styles.navText,tab===name&&styles.navActive]}>{name}</Text></Pressable>)}</View></SafeAreaView>;
}

const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:C.bg},header:{height:70,paddingHorizontal:18,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderColor:'#182434',backgroundColor:'#090E17'},headerBrand:{flexDirection:'row',alignItems:'center',gap:11},headerTitle:{fontSize:19,fontWeight:'900',letterSpacing:1.2,color:C.text},headerSub:{fontSize:9,color:C.muted,letterSpacing:2,marginTop:2},headerImport:{width:42,height:42,borderRadius:14,backgroundColor:'#102333',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#1E526A'},body:{flex:1},nav:{height:68,flexDirection:'row',backgroundColor:'#0C121C',borderTopWidth:1,borderColor:'#1B2A3B',paddingBottom:4},navItem:{flex:1,alignItems:'center',justifyContent:'center',gap:2},navIcon:{fontSize:22,color:'#6E7C91'},navText:{fontSize:10,color:'#78869A'},navActive:{color:C.cyan,fontWeight:'800'},homeContent:{padding:18,paddingBottom:36,gap:18},brand:{alignItems:'center',paddingVertical:15},brandName:{fontSize:29,fontWeight:'900',letterSpacing:3,color:C.text,marginTop:8},brandSub:{fontSize:9,letterSpacing:3,color:C.muted,marginTop:5},logoWrap:{width:42,height:42,alignItems:'center',justifyContent:'center'},logoLarge:{width:106,height:106},logoDiamond:{width:'86%',height:'86%',borderWidth:2,borderColor:C.cyan,transform:[{rotate:'45deg'}],alignItems:'center',justifyContent:'center',shadowColor:C.purple,shadowOpacity:.8,shadowRadius:12,elevation:8},logoLetters:{transform:[{rotate:'-45deg'}],fontSize:largeFont(),fontWeight:'900',color:C.text,letterSpacing:-3},homeTitleRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},h1:{fontSize:23,fontWeight:'900',color:C.text},muted:{fontSize:12,color:C.muted,marginTop:4},newButton:{backgroundColor:C.cyan,paddingHorizontal:15,paddingVertical:12,borderRadius:13},newButtonText:{color:'#04121A',fontWeight:'900',fontSize:13},featureGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},feature:{width:'48%',minHeight:135,borderRadius:18,borderWidth:1,borderColor:'#344458',backgroundColor:C.panel,padding:15,justifyContent:'center'},featureIcon:{fontSize:34,marginBottom:9},featureTitle:{fontSize:14,fontWeight:'800',color:C.text},featureSub:{fontSize:11,color:C.muted,marginTop:5},section:{backgroundColor:C.panel,borderRadius:17,borderWidth:1,borderColor:C.line,padding:15,gap:13},sectionHead:{gap:3},sectionTitle:{fontSize:13,fontWeight:'900',letterSpacing:1.1,color:C.cyan},sectionSub:{fontSize:10,color:C.muted},emptyCard:{borderWidth:1,borderColor:'#2A3A4E',borderStyle:'dashed',borderRadius:16,padding:25,alignItems:'center',gap:7},emptyIcon:{fontSize:30,color:C.cyan},cardTitle:{fontSize:14,fontWeight:'800',color:C.text},recentRow:{flexDirection:'row',alignItems:'center',gap:12,padding:10,borderRadius:13,backgroundColor:C.panel2},recentThumb:{width:54,height:45,borderRadius:9,backgroundColor:'#09111B',alignItems:'center',justifyContent:'center'},note:{borderRadius:14,padding:14,backgroundColor:'#111B2A',borderLeftWidth:3,borderLeftColor:C.purple},noteTitle:{fontSize:11,fontWeight:'900',color:C.purple,letterSpacing:1},noteText:{fontSize:11,color:C.muted,lineHeight:17,marginTop:6},editorContent:{padding:15,paddingBottom:30,gap:13},editorTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},importButton:{borderWidth:1,borderColor:C.cyan,borderRadius:12,paddingHorizontal:14,paddingVertical:10},importText:{color:C.cyan,fontWeight:'800'},previewCard:{borderRadius:17,overflow:'hidden',borderWidth:1,borderColor:'#314357',backgroundColor:'#02060C'},video:{width:'100%',height:Dimensions.get('window').width*.54,backgroundColor:'#000'},emptyPreview:{height:190,alignItems:'center',justifyContent:'center',gap:8},playIcon:{fontSize:42,color:C.cyan},previewFooter:{height:38,paddingHorizontal:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'#111B29'},previewName:{fontSize:11,color:C.text,flex:1},previewTag:{color:C.cyan,fontWeight:'900',fontSize:11},valueLine:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},value:{fontSize:16,fontWeight:'900',color:C.cyan},ruler:{gap:5,paddingVertical:4},fpsTick:{minWidth:39,height:40,paddingHorizontal:7,borderRadius:10,backgroundColor:'#202B3B',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#2C3B50'},fpsTickActive:{backgroundColor:'#0C5368',borderColor:C.cyan},fpsTickText:{fontSize:11,color:'#AAB6C8'},fpsTickTextActive:{fontWeight:'900',color:'#E9FCFF'},helper:{fontSize:10,color:C.muted,lineHeight:16},qualityRuler:{gap:8,paddingVertical:4},qualityChip:{minWidth:72,padding:10,borderRadius:11,backgroundColor:'#202B3B',alignItems:'center',borderWidth:1,borderColor:'#2C3B50'},qualityActive:{backgroundColor:'#0D5368',borderColor:C.cyan},qualityText:{fontSize:13,color:C.text,fontWeight:'800'},qualityTextActive:{color:'#E9FCFF'},qualityPixels:{fontSize:8,color:C.muted,marginTop:3},toggleRow:{minHeight:58,flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderColor:'#202D3E'},toggleTitle:{fontSize:13,fontWeight:'800',color:C.text},toggleSub:{fontSize:10,color:C.muted,marginTop:3},engineRow:{flexDirection:'row',alignItems:'center',gap:10,paddingVertical:9,borderBottomWidth:1,borderColor:'#202D3E'},engineName:{fontSize:12,fontWeight:'800',color:C.text},engineDetail:{fontSize:9,color:C.muted,marginTop:4},engineStatus:{fontSize:9,fontWeight:'800',color:C.warn,textAlign:'right'},actionRow:{flexDirection:'row',gap:10},resetButton:{padding:15,borderRadius:13,backgroundColor:'#1B2635',alignItems:'center',justifyContent:'center'},resetText:{color:C.text,fontWeight:'800'},exportButton:{flex:1,padding:15,borderRadius:13,backgroundColor:C.cyan,alignItems:'center',justifyContent:'center'},exportText:{color:'#04121A',fontWeight:'900',fontSize:12}
});
function largeFont(){return 28;}
