import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, ScrollView, Pressable, Image,
  Alert, StatusBar, ActivityIndicator, Switch, Dimensions, Linking, PanResponder, Share, TextInput
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useVideoPlayer, VideoView } from 'expo-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requireNativeModule } from 'expo-modules-core';
import { supabase } from './supabase';

const VideoEngine = requireNativeModule('EnhanceErrorVideoEngine');
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const C = { bg:'#070A11', panel:'#101722', panel2:'#151F2D', line:'#273548', cyan:'#32D9F5', blue:'#168DBB', purple:'#B56BFF', text:'#F3F7FF', muted:'#8C9AAF', green:'#37D6B0', warn:'#FFCB70' };
const FPS = [...Array.from({length:217},(_,i)=>i+24),300,360,480,600,720,960];
const FPS_PRESETS = [24,30,60,90,120,144,180,240];
const QUALITY_PRESETS = ['480p','720p','1080p','2K','4K','8K','16K'];
const QUALITIES = [{label:'144p',w:256,h:144},{label:'240p',w:426,h:240},{label:'360p',w:640,h:360},{label:'480p',w:854,h:480},{label:'540p',w:960,h:540},{label:'720p',w:1280,h:720},{label:'1080p',w:1920,h:1080},{label:'1440p',w:2560,h:1440},{label:'2K',w:2560,h:1440},{label:'4K',w:3840,h:2160},{label:'5K',w:5120,h:2880},{label:'6K',w:6144,h:3456},{label:'8K',w:7680,h:4320},{label:'12K',w:11520,h:6480},{label:'16K',w:15360,h:8640}];
const fpsLabel = n => n+' FPS';
const SOCIALS = [{name:'TikTok',handle:'@erroreditx99',url:'https://www.tiktok.com/@erroreditx99',mark:'♪',color:'#F5F7FA'},{name:'YouTube',handle:'ERROR EDITX',url:'https://m.youtube.com/@erroreditx-o2t',mark:'▶',color:'#FF3348'},{name:'Instagram',handle:'@erroreditx99',url:'https://www.instagram.com/erroreditx99',mark:'◎',color:'#E879C8'},{name:'Facebook',handle:'ERROR EDITX',url:'https://www.facebook.com/share/1CF15iyNv6/',mark:'f',color:'#4A9CFF'}];
function Pill({label,active,onPress,small=false}) { return <Pressable onPress={onPress} style={[styles.pill,small&&styles.smallPill,active&&styles.pillActive]}><Text style={[styles.pillText,active&&styles.pillTextActive]}>{label}</Text></Pressable>; }
function Section({title,subtitle,children}) { return <View style={styles.section}><View style={styles.sectionHead}><Text style={styles.sectionTitle}>{title}</Text>{subtitle?<Text style={styles.sectionSub}>{subtitle}</Text>:null}</View>{children}</View>; }
function Logo({large=false}) { return <View style={[styles.logoWrap,large&&styles.logoLarge]}><View style={styles.logoOuter}><View style={styles.logoDiamond}><Text style={styles.logoLetters}>EE</Text></View></View><View pointerEvents="none" style={styles.logoGlow}/></View>; }
function SocialIcon({name,color}){const common={fill:color};return <Svg width={23} height={23} viewBox="0 0 24 24">{name==='YouTube'?<><Path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8Z" {...common}/><Path d="m9.6 15.5 6.2-3.5-6.2-3.5v7Z" fill="#08111B"/></>:name==='Instagram'?<><Rect x="3" y="3" width="18" height="18" rx="5" stroke={color} strokeWidth="2" fill="none"/><Circle cx="12" cy="12" r="4.2" stroke={color} strokeWidth="2" fill="none"/><Circle cx="17.7" cy="6.5" r="1.2" {...common}/></>:name==='Facebook'?<Path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z" {...common}/>:<><Path d="M16.8 3c.3 2.4 1.7 3.8 4.2 4v3.1a9.1 9.1 0 0 1-4.2-1.3v6.4c0 3.6-3.9 5.8-7.1 4.1-3.4-1.8-2.8-6.9.9-8.1 1-.3 1.9-.3 2.8 0v3.3c-1.8-.6-3.3.2-3.3 1.7 0 1.8 2.5 2.3 3.4.8.2-.4.3-.9.3-1.4V3h3Z" {...common}/><Path d="M4 4h2v2H4z" fill="#fff" opacity=".0"/></>}</Svg>}
function SocialRow(){return <View style={styles.socialSection}><Text style={styles.socialHeading}>CONNECT WITH ERROR EDITX</Text><View style={styles.socialGrid}>{SOCIALS.map(s=><Pressable key={s.name} onPress={()=>Linking.openURL(s.url).catch(()=>Alert.alert('Unable to open link','Please check your internet connection.'))} style={styles.socialButton}><View style={[styles.socialMark,{borderColor:s.color}]}><SocialIcon name={s.name} color={s.color}/></View><View style={{flex:1,minWidth:0}}><Text style={styles.socialName}>{s.name}</Text><Text style={styles.socialHandle} numberOfLines={1}>{s.handle}</Text></View><Text style={styles.socialArrow}>↗</Text></Pressable>)}</View></View>;}
function FreeFireCard(){return <View style={styles.freeFireCard}><View style={styles.ffTop}><View style={styles.ffBadge}><Text style={styles.ffBadgeText}>FF</Text></View><View style={{flex:1}}><Text style={styles.ffTitle}>FREE FIRE PLAYER</Text><Text style={styles.ffSub}>YOUR PLAYER UID</Text></View><Text style={styles.ffLive}>GAMING ID</Text></View><Text style={styles.ffUid}>9087093434</Text><View style={styles.ffActions}><Pressable style={styles.ffButton} onPress={()=>Share.share({message:'My Free Fire UID: 9087093434'})}><Text style={styles.ffButtonText}>SHARE UID ↗</Text></Pressable><Pressable style={styles.ffButtonAlt} onPress={()=>Linking.openURL('https://ff.garena.com/').catch(()=>Alert.alert('Unable to open Free Fire','Please try again.'))}><Text style={styles.ffButtonAltText}>FREE FIRE WEBSITE</Text></Pressable></View><Text style={styles.ffHint}>UID is shown here for others to search in Free Fire. It is not a public profile URL.</Text></View>;}

export default function App() {
  const [tab,setTab]=useState('Home');
  const [showWelcome,setShowWelcome]=useState(true);
  useEffect(()=>{const timer=setTimeout(()=>setShowWelcome(false),3500);return ()=>clearTimeout(timer);},[]);
  const [videoUri,setVideoUri]=useState(null);
  const [videoName,setVideoName]=useState('');
  const [fps,setFps]=useState(60);
  const [fpsMultiplier,setFpsMultiplier]=useState(2);
  const [playbackSpeed,setPlaybackSpeed]=useState(1);
  const [splitMarks,setSplitMarks]=useState([]);
  const [quality,setQuality]=useState('1080p');
  const [ultra,setUltra]=useState(true);
  const [interpolation,setInterpolation]=useState(true);
  const [fpsEngine,setFpsEngine]=useState('rife');
  const [denoise,setDenoise]=useState(true);
  const [sharpen,setSharpen]=useState(true);
  const [stabilize,setStabilize]=useState(false);
  const [engineBusy,setEngineBusy]=useState(false);
  const [exportProgress,setExportProgress]=useState(0);
  const [exportStage,setExportStage]=useState('Preparing export');
  const [exportMode,setExportMode]=useState('full');
  const [trimStart,setTrimStart]=useState('0');
  const [trimEnd,setTrimEnd]=useState('');
  const [recent,setRecent]=useState([]);
  const [fpsSearch,setFpsSearch]=useState(false);
  const [qualityIndex,setQualityIndex]=useState(6);
  const [authSession,setAuthSession]=useState(null);
  const [authEmail,setAuthEmail]=useState('');
  const [authPassword,setAuthPassword]=useState('');
  const [authBusy,setAuthBusy]=useState(false);
  const player=useVideoPlayer(null,p=>{p.loop=true;});
  useEffect(()=>{ if(videoUri){ try{ player.replaceAsync(videoUri); }catch(e){} } },[videoUri,player]);
  useEffect(()=>{ try{ player.playbackRate=playbackSpeed; }catch(e){} },[playbackSpeed,player]);
  useEffect(()=>{
    const sub=VideoEngine.addListener?.('onExportProgress',event=>{
      setExportProgress(Math.max(0,Math.min(1,Number(event?.progress)||0)));
      setExportStage(event?.stage||'Exporting video');
    });
    return ()=>sub?.remove?.();
  },[]);
  useEffect(()=>{ AsyncStorage.getItem('enhance-error-recent').then(v=>{if(v)setRecent(JSON.parse(v));}).catch(()=>{}); },[]);
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>setAuthSession(data?.session||null)).catch(()=>{});
    const {data}=supabase.auth.onAuthStateChange((_event,session)=>setAuthSession(session));
    return ()=>data?.subscription?.unsubscribe?.();
  },[]);
  const authenticate=async(mode)=>{
    if(authBusy)return;
    if(!authEmail.trim()||!authPassword){Alert.alert('Account details required','Enter your email address and password.');return;}
    if(authPassword.length<8){Alert.alert('Password too short','Use at least 8 characters.');return;}
    setAuthBusy(true);
    try{
      const result=mode==='signup'
        ?await supabase.auth.signUp({email:authEmail.trim(),password:authPassword})
        :await supabase.auth.signInWithPassword({email:authEmail.trim(),password:authPassword});
      if(result.error)throw result.error;
      if(mode==='signup'&&!result.data?.session){
        Alert.alert('Check your email','Your account was created. Complete email confirmation, then sign in.');
      }else{
        setAuthPassword('');
        Alert.alert(mode==='signup'?'Account created':'Signed in','Your account is ready for authenticated GPU processing.');
      }
    }catch(error){Alert.alert('Account error',String(error?.message||error));}
    finally{setAuthBusy(false);}
  };
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
  const deleteProject=(uri)=>Alert.alert('Delete project?','This removes the saved project entry from Enhance Error. The original gallery video is not deleted.',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{const next=recent.filter(x=>x.uri!==uri);setRecent(next);AsyncStorage.setItem('enhance-error-recent',JSON.stringify(next)).catch(()=>{});if(videoUri===uri){setVideoUri(null);setVideoName('');setSplitMarks([]);} }}]);
  const deleteCurrentVideo=()=>Alert.alert('Remove video?','Remove this video from the current editing session?',[{text:'Cancel',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>{setVideoUri(null);setVideoName('');setSplitMarks([]);setPlaybackSpeed(1);}}]);
  const splitCurrentVideo=()=>{if(!videoUri){Alert.alert('No video','Import a video first.');return;}const t=Number(player.currentTime||0);if(t<=0){Alert.alert('Move playhead','Move the video playhead to the point where you want to split, then press Split.');return;}setSplitMarks(prev=>[...prev,t].sort((a,b)=>a-b));Alert.alert('Split point added','A split marker was added at '+t.toFixed(2)+' seconds. Actual split-file export requires the timeline export engine, which is not yet connected.');};
  const startEnhancement=async()=>{
    if(!videoUri){Alert.alert('Select a video','Choose a video first.');return;}
    if(engineBusy)return;
    const startMs=exportMode==='range'?Math.max(0,Math.round((Number(trimStart)||0)*1000)):0;
    const endMs=exportMode==='range'?Math.round((Number(trimEnd)||0)*1000):-1;
    if(exportMode==='range'&&(!Number.isFinite(endMs)||endMs<=startMs)){
      Alert.alert('Check selected range','Enter an end time greater than the start time, in seconds.');return;
    }
    setEngineBusy(true);setExportProgress(0.01);setExportStage('Preparing video');
    try{
      let result;
      if(interpolation){
        if(exportMode==='range'){
          throw new Error('RIFE GPU processing currently supports the full video only. Range trimming is not yet available in the GPU job pipeline.');
        }
        if(fpsEngine!=='rife'){
          throw new Error('The selected engine is not deployed yet. RIFE is the only engine currently wired for video processing.');
        }
        if(fpsMultiplier!==2){
          throw new Error('The current RIFE GPU worker supports 2× interpolation only. Select 2× to continue.');
        }
        if(!SUPABASE_URL || !SUPABASE_ANON_KEY){
          throw new Error('Supabase URL and publishable/anon key are not configured in the EAS build environment.');
        }
        const {data:sessionData,error:sessionError}=await supabase.auth.getSession();
        if(sessionError) throw sessionError;
        const accessToken=sessionData?.session?.access_token;
        if(!accessToken){
          throw new Error('Sign in to your Enhance Error account first. RIFE processing requires an authenticated Supabase user session.');
        }
        const functionUrl=SUPABASE_URL.replace(/\/+$/,'')+'/functions/v1/rife-video';
        setExportStage('Uploading video to RIFE GPU');
        result=await VideoEngine.interpolateRifeVideo(videoUri,functionUrl,SUPABASE_ANON_KEY,accessToken);
      }else{
        result=await VideoEngine.exportVideo(videoUri,selectedQuality.w,selectedQuality.h,startMs,endMs);
      }
      if(!result?.galleryUri||!String(result.galleryUri).startsWith('content://')){
        throw new Error('Android did not confirm that the exported video was saved to Gallery.');
      }
      setExportProgress(1);setExportStage('Saved to Gallery');
      const outputUri=result.galleryUri;
      const exportedName=(exportMode==='range'?'Trimmed ':'Exported ')+videoName;
      setVideoUri(outputUri);
      setVideoName(exportedName);
      const savedItem={name:exportedName,uri:outputUri,date:Date.now()};
      const next=[savedItem,...recent.filter(x=>x.uri!==outputUri)].slice(0,8);
      setRecent(next);
      await AsyncStorage.setItem('enhance-error-recent',JSON.stringify(next));
      Alert.alert('Saved to Gallery',result.engine==='RIFE'?'RIFE 2× interpolation is complete. The output video is saved in Movies/Enhance Error; source resolution and audio are preserved.':'Your video is saved in Movies/Enhance Error and is available in your phone Gallery. Output: '+result.width+' × '+result.height+'.');
    }catch(error){
      setExportStage('Export failed');
      Alert.alert('Video export failed',String(error?.message||error||'Unknown native video engine error'));
    }finally{setEngineBusy(false);}
  };
  const reset=()=>{setFps(60);setQuality('1080p');setQualityIndex(6);setUltra(true);setInterpolation(true);setDenoise(true);setSharpen(true);setStabilize(false);};
  const Home=()=> <ScrollView style={styles.scroller} contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={true} indicatorStyle="white" nestedScrollEnabled decelerationRate="normal" overScrollMode="always" removeClippedSubviews={false}>
    <View style={styles.heroCard}><View pointerEvents="none" style={styles.heroGlowA}/><View pointerEvents="none" style={styles.heroGlowB}/><Logo large/><Text style={styles.brandName}>ENHANCE <Text style={{color:C.cyan}}>ERROR</Text></Text><Text style={styles.brandSub}>AI VIDEO ENHANCEMENT STUDIO</Text><Text style={styles.powered}>POWERED BY MUNEEB HASSAN</Text><Text style={styles.creatorId}>@ERROREDITX99</Text></View>
    <View style={styles.homeTitleRow}><View><Text style={styles.h1}>Your Studio</Text><Text style={styles.muted}>Restore detail. Create smoother motion.</Text></View><Pressable style={styles.newButton} onPress={pickVideo}><Text style={styles.newButtonText}>＋ New Video</Text></Pressable></View>
    <View style={styles.featureGrid}>
      <Feature icon="✧" title="AI Ultra Enhance" sub="Detail recovery & denoise" color={C.cyan} onPress={()=>setTab('Enhance')}/>
      <Feature icon="◷" title="Frame Interpolation" sub="24–960 FPS targets" color={C.green} onPress={()=>setTab('Enhance')}/>
      <Feature icon="◇" title="Quality Upscaler" sub="144p to 16K targets" color={C.purple} onPress={()=>setTab('Enhance')}/>
      <Feature icon="⌁" title="Stabilization" sub="Motion correction controls" color={C.cyan} onPress={()=>setTab('Enhance')}/>
    </View>
    <Section title="ENHANCE ERROR ACCOUNT" subtitle="Required for secure GPU processing">
      {authSession?<View style={{gap:8}}><Text style={styles.cardTitle}>Signed in</Text><Text style={styles.muted}>{authSession.user?.email||'Enhance Error account'}</Text><Pressable style={styles.importButton} onPress={async()=>{await supabase.auth.signOut();}}><Text style={styles.importText}>SIGN OUT</Text></Pressable></View>:<View style={{gap:9}}><TextInput value={authEmail} onChangeText={setAuthEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Email address" placeholderTextColor={C.muted} style={styles.trimInput}/><TextInput value={authPassword} onChangeText={setAuthPassword} secureTextEntry placeholder="Password (minimum 8 characters)" placeholderTextColor={C.muted} style={styles.trimInput}/><View style={{flexDirection:'row',gap:8}}><Pressable style={[styles.importButton,{flex:1}]} onPress={()=>authenticate('signin')}><Text style={styles.importText}>{authBusy?'PLEASE WAIT':'SIGN IN'}</Text></Pressable><Pressable style={[styles.newButton,{flex:1}]} onPress={()=>authenticate('signup')}><Text style={styles.newButtonText}>CREATE ACCOUNT</Text></Pressable></View><Text style={styles.helper}>Create or sign in to an account to securely access the RIFE GPU service.</Text></View>}
    </Section>
    <Section title="RECENT PROJECTS" subtitle="On this device">
      {recent.length===0?<Pressable onPress={pickVideo} style={styles.emptyCard}><Text style={styles.emptyIcon}>▣</Text><Text style={styles.cardTitle}>Start your first enhancement</Text><Text style={styles.muted}>Import a video to open the enhancement studio</Text></Pressable>:recent.map((r,i)=><View key={r.uri+i} style={styles.recentRow}><Pressable style={{flex:1,flexDirection:'row',alignItems:'center',gap:12}} onPress={()=>{setVideoUri(r.uri);setVideoName(r.name);setTab('Enhance');}}><View style={styles.recentThumb}><Text style={{color:C.cyan,fontSize:22}}>▶</Text></View><View style={{flex:1}}><Text style={styles.cardTitle} numberOfLines={1}>{r.name}</Text><Text style={styles.muted}>Tap to continue · Local media</Text></View><Text style={{color:C.cyan}}>OPEN ›</Text></Pressable><Pressable onPress={()=>deleteProject(r.uri)} style={{padding:10,marginLeft:6,borderRadius:10,backgroundColor:'#3A1822'}}><Text style={{color:'#FF8A9B',fontWeight:'900'}}>DELETE</Text></Pressable></View>)}
    </Section>
    <SocialRow/><FreeFireCard/><View style={styles.note}><Text style={styles.noteTitle}>ENGINE STATUS</Text><Text style={styles.noteText}>Preview and project controls are available. AI rendering engines are not yet installed or connected in this build.</Text></View>
  </ScrollView>;
  const Feature=({icon,title,sub,color,onPress})=><Pressable onPress={onPress} style={styles.feature}><Text style={[styles.featureIcon,{color}]}>{icon}</Text><Text style={styles.featureTitle}>{title}</Text><Text style={styles.featureSub}>{sub}</Text></Pressable>;
  const Enhance=()=> <ScrollView style={styles.scroller} contentContainerStyle={styles.editorContent} showsVerticalScrollIndicator={true} indicatorStyle="white" nestedScrollEnabled decelerationRate="normal" overScrollMode="always" removeClippedSubviews={false}>
    <View style={styles.editorTop}><View><Text style={styles.h1}>Enhancement Studio</Text><Text style={styles.muted}>Non-destructive settings preview</Text></View><Pressable onPress={pickVideo} style={styles.importButton}><Text style={styles.importText}>＋ Import</Text></Pressable></View>
    <View style={styles.previewCard}>
      {videoUri?<VideoView player={player} style={styles.video} nativeControls contentFit="contain"/>:<Pressable style={styles.emptyPreview} onPress={pickVideo}><Text style={styles.playIcon}>▶</Text><Text style={styles.cardTitle}>Import video to preview</Text><Text style={styles.muted}>MP4 · MOV · supported gallery videos</Text></Pressable>}
      <View style={styles.previewFooter}><Text numberOfLines={1} style={styles.previewName}>{videoName||'No video selected'}</Text><Text style={styles.previewTag}>{quality}</Text></View>
    </View>
    <Section title="FRAME RATE" subtitle="Spin the precision wheel to select output FPS">
      <View style={styles.valueLine}><Text style={styles.muted}>Selected output</Text><Text style={styles.value}>{fpsLabel(fps)}</Text></View>
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:7}}>{[{v:1,t:'Original'},{v:2,t:'2×'},{v:4,t:'4×'},{v:8,t:'8×'},{v:16,t:'16×'},{v:32,t:'32×'}].map(x=><Pill key={x.v} label={x.t} active={fpsMultiplier===x.v} onPress={()=>{setFpsMultiplier(x.v);setInterpolation(x.v>1);if(x.v>1)setFps(Math.min(960,30*x.v));}} small/> )}</View><Text style={styles.helper}>{fpsMultiplier===1?'Original frame rate selected — no frame multiplication.':`Frame expansion target: ${fpsMultiplier}×. Set output FPS below; real AI frame generation requires the connected model worker.`}</Text><WheelGauge values={FPS} value={fps} onChange={setFps} suffix="FPS"/><QuickOptions title="QUICK FPS" values={FPS_PRESETS} value={fps} suffix="FPS" onChange={setFps}/>
      <Text style={styles.helper}>24–240 FPS in 1 FPS steps, plus higher experimental targets. Hardware and source frame rate determine what can really be rendered.</Text>
    </Section>
    <Section title="OUTPUT RESOLUTION" subtitle="Spin the resolution wheel to select output size">
      <View style={styles.valueLine}><Text style={styles.muted}>Target resolution</Text><Text style={styles.value}>{quality}</Text></View>
      <WheelGauge values={QUALITIES.map(q=>q.label)} value={quality} onChange={label=>{const i=QUALITIES.findIndex(q=>q.label===label);setQualityIndex(i);setQuality(label);}}/><QuickOptions title="QUICK QUALITY" values={QUALITY_PRESETS} value={quality} onChange={label=>{const i=QUALITIES.findIndex(q=>q.label===label);setQualityIndex(i);setQuality(label);}}/>
      <Text style={styles.helper}>16K is a selectable target only. Large outputs need substantial memory, storage and compatible processing hardware.</Text>
    </Section>
    <Section title="CLIP EDITING" subtitle="Choose the full video or export only a selected time range"><View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}><Pill label="Full video" active={exportMode==='full'} onPress={()=>setExportMode('full')}/><Pill label="Selected range / Cut" active={exportMode==='range'} onPress={()=>setExportMode('range')}/><Pill label="Delete video" active={false} onPress={deleteCurrentVideo}/></View>{exportMode==='range'?<><Text style={styles.toggleTitle}>Trim range · seconds</Text><View style={{flexDirection:'row',gap:10}}><View style={{flex:1}}><Text style={styles.toggleSub}>START</Text><TextInput value={trimStart} onChangeText={setTrimStart} keyboardType="decimal-pad" placeholder="0.0" placeholderTextColor={C.muted} style={styles.trimInput}/></View><View style={{flex:1}}><Text style={styles.toggleSub}>END</Text><TextInput value={trimEnd} onChangeText={setTrimEnd} keyboardType="decimal-pad" placeholder="e.g. 12.5" placeholderTextColor={C.muted} style={styles.trimInput}/></View></View><Text style={styles.helper}>Only the selected time range will be exported as a separate video file. Enter seconds.</Text></>:<Text style={styles.helper}>Full source video selected for export.</Text>}<View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}><Pill label="＋ Mark split at playhead" active={false} onPress={splitCurrentVideo}/></View><Text style={styles.helper}>Split markers: {splitMarks.length?splitMarks.map(x=>x.toFixed(2)+'s').join(' · '):'None'} · Markers are guides only; multi-clip splitting is not yet available.</Text><Text style={styles.toggleTitle}>Playback speed · {playbackSpeed.toFixed(2)}×</Text><View style={{flexDirection:'row',flexWrap:'wrap',gap:7}}>{[0.25,0.5,0.75,1,1.25,1.5,2,3,4].map(v=><Pill key={v} label={v+'×'} active={playbackSpeed===v} onPress={()=>setPlaybackSpeed(v)} small/>)}</View><Text style={styles.helper}>Speed currently changes preview playback. Applying speed to the exported video needs the timeline export engine.</Text></Section>
    <Section title="AI ENHANCEMENT" subtitle="Enable desired processing stages">
      <Toggle title="AI Ultra Enhancement" sub="AI detail reconstruction" value={ultra} onChange={setUltra}/>
      <Toggle title="Frame Interpolation" sub="Generate intermediate frames" value={interpolation} onChange={setInterpolation}/>
      <Toggle title="Denoise" sub="Reduce compression and sensor noise" value={denoise} onChange={setDenoise}/>
      <Toggle title="Detail Sharpening" sub="Controlled edge enhancement" value={sharpen} onChange={setSharpen}/>
      <Toggle title="Video Stabilization" sub="Reduce unwanted camera movement" value={stabilize} onChange={setStabilize}/>
    </Section>
    <Section title="FPS ENGINE SELECTION" subtitle="Choose the interpolation engine for this project">
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
        {[{id:'rife',name:'RIFE'},{id:'film',name:'Google FILM · 32x'},{id:'dain',name:'DAIN'},{id:'cain',name:'CAIN'},{id:'flavr',name:'FLAVR'},{id:'combined',name:'Combined AI'}].map(item=><Pressable key={item.id} onPress={()=>setFpsEngine(item.id)} style={{paddingHorizontal:13,paddingVertical:11,borderRadius:14,borderWidth:1,borderColor:fpsEngine===item.id?C.cyan:C.line,backgroundColor:fpsEngine===item.id?'rgba(50,217,245,0.13)':C.panel2}}>
          <Text style={{color:fpsEngine===item.id?C.cyan:C.text,fontSize:12,fontWeight:'900'}}>{item.name}{fpsEngine===item.id?'  ✓':''}</Text>
        </Pressable>)}
      </View>
      <Text style={styles.helper}>{fpsEngine==='rife'?'Selected: RIFE 2× frame interpolation. Requires a deployed GPU worker and signed-in account.':fpsEngine==='film'?'Selected: Google FILM. 32x is a target expansion mode and requires a deployed FILM model/GPU worker.':fpsEngine==='dain'?'Selected: DAIN interpolation adapter. Runtime and licensed model weights are required.':fpsEngine==='cain'?'Selected: CAIN interpolation adapter. Runtime and model weights are required.':fpsEngine==='flavr'?'Selected: FLAVR interpolation adapter. Runtime and model weights are required.':'Selected: Combined mode. Available models will be coordinated in one project after the GPU worker is deployed.'}</Text>
    </Section>
    <Section title="PROCESSING ENGINES" subtitle="Integration status">
      <Engine name="RIFE Frame Interpolation" detail="2× video API + Android upload and Gallery-save path added; GPU deployment and weights required" status="Deployment pending"/>
      <Engine name="Google FILM Interpolation" detail="Selectable up to 32x target · inference runtime and model weights required" status="Adapter slot added"/>
      <Engine name="DAIN Interpolation" detail="Optional frame interpolation adapter · runtime and weights required" status="Adapter slot added"/>
      <Engine name="CAIN Interpolation" detail="Optional frame interpolation adapter · runtime and weights required" status="Adapter slot added"/>
      <Engine name="FLAVR Interpolation" detail="Optional frame interpolation adapter · runtime and weights required" status="Adapter slot added"/>
      <Engine name="Combined FPS Pipeline" detail="Coordinates available interpolation models in one project" status="GPU worker pending"/>
      <Engine name="Real-ESRGAN Super Resolution" detail="AI upscaling · inference runtime and model weights required" status="Adapter slot added"/>
      <Engine name="FFmpeg Processing" detail="Decode, filters, encode and audio mux · worker build required" status="Worker pending"/>
      <Engine name="AI Denoise" detail="Control is present · actual AI filter requires runtime" status="Runtime pending"/>
      <Engine name="AI Stabilization" detail="Control is present · motion analysis/filter requires runtime" status="Runtime pending"/>
      <Engine name="Android Media3 Video Export" detail="On-device decode, scale and MP4 encode" status="Native engine added"/>
      <Engine name="Topaz Video AI" detail="Commercial proprietary software" status="PENDING"/>
    </Section>
    {engineBusy&&<View style={{marginTop:14,marginBottom:12,padding:16,borderRadius:16,backgroundColor:"#101F2D",borderWidth:1,borderColor:C.cyan}}><View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}><Text style={{color:C.cyan,fontWeight:"900",fontSize:13}}>VIDEO EXPORTING</Text><Text style={{color:C.text,fontWeight:"900",fontSize:18,fontVariant:["tabular-nums"]}}>{Math.round(exportProgress*100)}%</Text></View><View style={{height:10,marginTop:12,backgroundColor:"#26394A",borderRadius:8,overflow:"hidden"}}><View style={{height:10,width:`${Math.max(2,Math.round(exportProgress*100))}%`,backgroundColor:C.cyan,borderRadius:8}}/></View><Text style={{color:C.muted,fontSize:12,marginTop:9}}>{exportStage}</Text><Text style={{color:C.muted,fontSize:11,marginTop:4}}>Preparing · Encoding · Finalizing</Text></View>}
    <View style={styles.actionRow}><Pressable style={styles.resetButton} onPress={reset}><Text style={styles.resetText}>RESET</Text></Pressable><Pressable style={styles.exportButton} onPress={startEnhancement}><Text style={styles.exportText}>{engineBusy?'PROCESSING VIDEO…':'EXPORT VIDEO  →'}</Text></Pressable></View>
  </ScrollView>;
  const Toggle=({title,sub,value,onChange})=><View style={styles.toggleRow}><View style={{flex:1}}><Text style={styles.toggleTitle}>{title}</Text><Text style={styles.toggleSub}>{sub}</Text></View><Switch value={value} onValueChange={onChange} trackColor={{false:'#354154',true:'#167F9D'}} thumbColor={value?C.cyan:'#B5C0CF'}/></View>;
  const Engine=({name,detail,status})=><View style={styles.engineRow}><View style={{flex:1}}><Text style={styles.engineName}>{name}</Text><Text style={styles.engineDetail}>{detail}</Text></View><Text style={styles.engineStatus}>{status}</Text></View>;
  const Projects=()=> <ScrollView style={styles.scroller} contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={true} nestedScrollEnabled decelerationRate="normal" overScrollMode="always" removeClippedSubviews={false}><Text style={styles.h1}>Projects</Text><Text style={styles.muted}>Recent videos stored on this device</Text>{recent.length?recent.map((r,i)=><View key={r.uri+i} style={styles.recentRow}><Pressable style={{flex:1,flexDirection:'row',alignItems:'center',gap:10}} onPress={()=>{setVideoUri(r.uri);setVideoName(r.name);setTab('Enhance');}}><View style={styles.recentThumb}><Text style={{color:C.cyan}}>▶</Text></View><Text style={{color:C.text,flex:1}} numberOfLines={1}>{r.name}</Text><Text style={{color:C.cyan}}>EDIT</Text></Pressable><Pressable onPress={()=>deleteProject(r.uri)} style={{padding:10,marginLeft:6,borderRadius:10,backgroundColor:'#3A1822'}}><Text style={{color:'#FF8A9B',fontWeight:'900'}}>DELETE</Text></Pressable></View>):<View style={styles.emptyCard}><Text style={styles.muted}>No projects yet. Import a video to begin.</Text></View>}<Pressable style={styles.newButton} onPress={pickVideo}><Text style={styles.newButtonText}>＋ Import Video</Text></Pressable></ScrollView>;
  const Settings=()=> <ScrollView contentContainerStyle={styles.homeContent}><Text style={styles.h1}>Settings</Text><View style={styles.engineRow}><Text style={styles.engineName}>App</Text><Text style={styles.engineStatus}>Enhance Error 1.0.0</Text></View><View style={styles.engineRow}><Text style={styles.engineName}>Theme</Text><Text style={styles.engineStatus}>Dark · Neon cyan / violet</Text></View><View style={styles.engineRow}><Text style={styles.engineName}>AI processing</Text><Text style={styles.engineStatus}>Backend not connected</Text></View><Text style={styles.helper}>No AI operation will be reported as completed until the processing backend returns a verified output file.</Text></ScrollView>;
  const content=tab==='Home'?<Home/>:tab==='Enhance'?<Enhance/>:tab==='Projects'?<Projects/>:<Settings/>;
  return <SafeAreaView style={styles.safe}><StatusBar barStyle="light-content" backgroundColor={C.bg}/><View style={styles.header}><View style={styles.headerBrand}><Logo/><View><Text style={styles.headerTitle}>ENHANCE <Text style={{color:C.cyan}}>ERROR</Text></Text><Text style={styles.headerSub}>VIDEO AI STUDIO</Text></View></View><Pressable onPress={pickVideo} style={styles.headerImport}><Text style={{color:C.cyan,fontSize:20}}>＋</Text></Pressable></View><View style={styles.body}>{content}</View><View style={styles.nav}>{[['Home','⌂'],['Projects','▣'],['Enhance','✧'],['Settings','⚙']].map(([name,icon])=><Pressable key={name} onPress={()=>setTab(name)} style={styles.navItem}><Text style={[styles.navIcon,tab===name&&styles.navActive]}>{icon}</Text><Text style={[styles.navText,tab===name&&styles.navActive]}>{name}</Text></Pressable>)}</View>{engineBusy?<View style={styles.exportOverlay}><View style={styles.exportPanel}><ActivityIndicator size="large" color={C.cyan}/><Text style={styles.exportTitle}>{exportStage}</Text><Text style={styles.exportPercent}>{Math.round(exportProgress*100)}%</Text><View style={styles.exportTrack}><View style={[styles.exportFill,{width:(exportProgress*100)+'%'}]}/></View><Text style={styles.exportHint}>Keep the app open while Android processes your video.</Text></View></View>:null}{showWelcome?<View style={styles.welcomeOverlay}><View style={styles.welcomeSmokeOne}/><View style={styles.welcomeSmokeTwo}/><Logo large/><Text style={styles.welcomeApp}>ENHANCE <Text style={{color:C.cyan}}>ERROR</Text></Text><Text style={styles.welcomeTag}>AI VIDEO ENHANCEMENT STUDIO</Text><View style={styles.welcomeLine}/><Text style={styles.welcomeCreator}>ERROR EDITS 99</Text><Text style={styles.welcomePowered}>POWERED BY MUNEEB HASSAN</Text></View>:null}</SafeAreaView>;
}

const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:C.bg},
 heroCard:{alignItems:'center',paddingVertical:28,paddingHorizontal:16,borderRadius:28,borderWidth:1,borderColor:'rgba(178,215,245,0.22)',backgroundColor:'rgba(23,34,52,0.58)',overflow:'hidden',shadowColor:C.cyan,shadowOpacity:.15,shadowRadius:24,elevation:9},
 heroGlowA:{position:'absolute',width:210,height:210,borderRadius:110,backgroundColor:'#075C79',opacity:.16,top:-80,left:-50},
 heroGlowB:{position:'absolute',width:180,height:180,borderRadius:100,backgroundColor:'#6C2E9B',opacity:.18,bottom:-80,right:-30},
 powered:{fontSize:9,letterSpacing:2,color:'#D4E9F6',marginTop:10,fontWeight:'800'},creatorId:{fontSize:10,letterSpacing:2,color:C.cyan,marginTop:5,fontWeight:'900'},
 logoOuter:{width:'92%',height:'92%',borderRadius:60,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'#BDEFFF',backgroundColor:'#101B2B',shadowColor:C.purple,shadowOpacity:.9,shadowRadius:20,elevation:14},
 logoGlow:{position:'absolute',width:'100%',height:'100%',borderRadius:60,borderWidth:1.5,borderColor:C.purple,opacity:.7},
 socialSection:{padding:15,borderRadius:18,backgroundColor:'#0D1623',borderWidth:1,borderColor:'#344A63',gap:12},socialHeading:{fontSize:11,fontWeight:'900',letterSpacing:1.5,color:C.cyan},socialGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:9},
 socialButton:{width:'48%',minHeight:60,padding:8,flexDirection:'row',alignItems:'center',gap:8,borderRadius:17,backgroundColor:'rgba(170,200,230,0.07)',borderWidth:1,borderColor:'rgba(180,210,240,0.18)'},socialMark:{width:34,height:34,borderRadius:10,borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#0A111B'},socialName:{fontSize:11,fontWeight:'900',color:C.text},socialHandle:{fontSize:8,color:C.muted,marginTop:2},socialArrow:{color:C.cyan,fontSize:14,fontWeight:'900'},
 wheelShell:{minHeight:218,borderRadius:24,borderWidth:1,borderColor:'rgba(151,198,235,0.28)',backgroundColor:'rgba(20,31,49,0.72)',overflow:'hidden',flexDirection:'row',alignItems:'center',padding:12,shadowColor:C.cyan,shadowOpacity:.12,shadowRadius:20,elevation:7},wheelTopGlow:{position:'absolute',top:-65,left:'15%',width:'70%',height:130,borderRadius:100,backgroundColor:'#164B70',opacity:.22},wheelViewport:{height:184,flex:1,overflow:'hidden',justifyContent:'center',borderRadius:18,backgroundColor:'rgba(5,14,26,0.68)',borderWidth:1,borderColor:'rgba(193,222,255,0.12)'},wheelScroll:{height:184},wheelContent:{alignItems:'center'},wheelItem:{height:46,width:'100%',alignItems:'center',justifyContent:'center'},wheelItemText:{fontSize:17,fontWeight:'700',color:'#74869D',letterSpacing:.7},wheelItemActive:{fontSize:23,fontWeight:'900',color:'#F2FBFF',textShadowColor:C.cyan,textShadowRadius:12},wheelCenterBand:{position:'absolute',top:70,left:5,right:5,height:46,borderRadius:13,borderWidth:1.3,borderColor:'rgba(96,222,255,0.85)',backgroundColor:'rgba(51,165,205,0.18)'},wheelFadeTop:{position:'absolute',top:0,left:0,right:0,height:48,backgroundColor:'rgba(7,14,25,0.30)'},wheelFadeBottom:{position:'absolute',bottom:0,left:0,right:0,height:48,backgroundColor:'rgba(7,14,25,0.30)'},wheelSide:{width:66,alignItems:'center',justifyContent:'center',gap:7},wheelSideText:{fontSize:7,fontWeight:'900',letterSpacing:.8,color:C.cyan,textAlign:'center'},wheelSideArrow:{fontSize:18,color:'#91A9C4'},wheelValuePill:{position:'absolute',right:88,top:7,paddingHorizontal:10,paddingVertical:4,borderRadius:12,backgroundColor:'rgba(22,95,123,0.70)',borderWidth:1,borderColor:'rgba(91,220,255,0.65)'},wheelValueText:{fontSize:10,fontWeight:'900',color:'#E7FCFF'},quickWrap:{gap:8},quickTitle:{fontSize:9,fontWeight:'900',letterSpacing:1.5,color:'#9EB5CD'},quickList:{gap:8,paddingVertical:2},quickChip:{minHeight:38,paddingHorizontal:14,justifyContent:'center',alignItems:'center',borderRadius:14,backgroundColor:'rgba(178,205,235,0.07)',borderWidth:1,borderColor:'rgba(178,205,235,0.16)'},quickChipActive:{backgroundColor:'rgba(48,180,218,0.20)',borderColor:'rgba(91,220,255,0.8)'},quickChipText:{fontSize:11,fontWeight:'800',color:'#A8B8CC'},quickChipTextActive:{color:'#E9FBFF'},freeFireCard:{padding:15,borderRadius:20,borderWidth:1,borderColor:'#805C32',backgroundColor:'#17140F',gap:12,overflow:'hidden'},ffTop:{flexDirection:'row',alignItems:'center',gap:10},ffBadge:{width:40,height:40,borderRadius:20,backgroundColor:'#E5A53C',alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'#FFE0A1'},ffBadgeText:{fontSize:16,fontWeight:'900',color:'#251708'},ffTitle:{fontSize:12,fontWeight:'900',letterSpacing:1.2,color:'#FFE2AC'},ffSub:{fontSize:9,letterSpacing:1.5,color:'#A58B68',marginTop:3},ffLive:{fontSize:8,fontWeight:'900',color:'#E9B95D',letterSpacing:1},ffUid:{fontSize:27,fontWeight:'900',letterSpacing:3,color:'#FFF1D5',textAlign:'center',paddingVertical:7},ffActions:{flexDirection:'row',gap:8},ffButton:{flex:1,alignItems:'center',padding:11,borderRadius:11,backgroundColor:'#D99B37'},ffButtonText:{fontSize:10,fontWeight:'900',color:'#251708'},ffButtonAlt:{flex:1,alignItems:'center',padding:11,borderRadius:11,borderWidth:1,borderColor:'#9D743C'},ffButtonAltText:{fontSize:9,fontWeight:'900',color:'#FFE2AC'},ffHint:{fontSize:9,lineHeight:14,color:'#B69D79'},gaugeValue:{alignSelf:'center',paddingHorizontal:16,paddingVertical:6,borderRadius:10,backgroundColor:'#0B5368',borderWidth:1,borderColor:C.cyan},gaugeValueText:{color:'#E8FBFF',fontSize:16,fontWeight:'900'},
 gaugeTouch:{height:34,justifyContent:'center',marginHorizontal:8},gaugeTrack:{height:5,borderRadius:4,backgroundColor:'#344255',position:'absolute',left:0,right:0},gaugeFill:{height:5,borderRadius:4,backgroundColor:C.cyan,position:'absolute',left:0},gaugeKnob:{position:'absolute',width:22,height:22,borderRadius:12,marginLeft:-11,backgroundColor:'#D9F9FF',borderWidth:3,borderColor:C.cyan,alignItems:'center',justifyContent:'center'},gaugeKnobCore:{width:6,height:6,borderRadius:3,backgroundColor:'#087B9B'},gaugeLabels:{flexDirection:'row',justifyContent:'space-between'},gaugeLabel:{fontSize:9,color:C.muted,fontWeight:'800'},
 welcomeOverlay:{...StyleSheet.absoluteFillObject,backgroundColor:'#03060D',alignItems:'center',justifyContent:'center',zIndex:100,padding:24,overflow:'hidden'},welcomeSmokeOne:{position:'absolute',width:360,height:360,borderRadius:180,backgroundColor:'#142C43',opacity:.34,top:'5%',left:'-30%'},welcomeSmokeTwo:{position:'absolute',width:330,height:330,borderRadius:170,backgroundColor:'#46205C',opacity:.3,bottom:'4%',right:'-25%'},welcomeApp:{fontSize:28,fontWeight:'900',letterSpacing:2.5,color:C.text,marginTop:26,textAlign:'center'},welcomeTag:{fontSize:9,letterSpacing:3,color:'#9AAEC4',marginTop:8},welcomeLine:{width:100,height:2,backgroundColor:C.cyan,marginVertical:22},welcomeCreator:{fontSize:14,letterSpacing:3,color:C.text,fontWeight:'900'},welcomePowered:{fontSize:10,letterSpacing:2,color:C.cyan,marginTop:8},
scroller:{flex:1},header:{height:64,paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderColor:'#182434',backgroundColor:'#090E17'},headerBrand:{flexDirection:'row',alignItems:'center',gap:11},headerTitle:{fontSize:19,fontWeight:'900',letterSpacing:1.2,color:C.text},headerSub:{fontSize:9,color:C.muted,letterSpacing:2,marginTop:2},headerImport:{width:42,height:42,borderRadius:18,backgroundColor:'rgba(38,76,102,0.38)',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'rgba(120,204,238,0.35)'},body:{flex:1},nav:{height:64,flexDirection:'row',backgroundColor:'rgba(18,27,42,0.92)',borderTopWidth:1,borderColor:'rgba(171,207,237,0.16)',paddingBottom:4},navItem:{flex:1,alignItems:'center',justifyContent:'center',gap:2},navIcon:{fontSize:22,color:'#6E7C91'},navText:{fontSize:10,color:'#78869A'},navActive:{color:C.cyan,fontWeight:'800'},homeContent:{paddingHorizontal:16,paddingTop:16,paddingBottom:54,gap:16},brand:{alignItems:'center',paddingVertical:15},brandName:{fontSize:29,fontWeight:'900',letterSpacing:3,color:C.text,marginTop:8},brandSub:{fontSize:9,letterSpacing:3,color:C.muted,marginTop:5},logoWrap:{width:44,height:44,borderRadius:30,alignItems:'center',justifyContent:'center',backgroundColor:'#0C1A2B',borderWidth:1,borderColor:'#496C91',shadowColor:C.cyan,shadowOpacity:.5,shadowRadius:12,elevation:8},logoLarge:{width:116,height:116,borderRadius:60},logoDiamond:{width:'82%',height:'82%',borderRadius:50,borderWidth:2,borderColor:C.cyan,alignItems:'center',justifyContent:'center',backgroundColor:'#0B1726',shadowColor:C.purple,shadowOpacity:.8,shadowRadius:14,elevation:9},logoLetters:{transform:[{rotate:'-45deg'}],fontSize:largeFont(),fontWeight:'900',color:C.text,letterSpacing:-3},homeTitleRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},h1:{fontSize:23,fontWeight:'900',color:C.text},muted:{fontSize:12,color:C.muted,marginTop:4},newButton:{backgroundColor:'rgba(63,193,224,0.20)',paddingHorizontal:15,paddingVertical:12,borderRadius:16,borderWidth:1,borderColor:'rgba(111,224,255,0.58)'},newButtonText:{color:'#DDF9FF',fontWeight:'900',fontSize:13},featureGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},feature:{width:'48%',minHeight:126,borderRadius:22,borderWidth:1,borderColor:'rgba(180,210,240,0.20)',backgroundColor:'rgba(25,39,58,0.64)',padding:15,justifyContent:'center',shadowColor:C.cyan,shadowOpacity:.07,shadowRadius:12,elevation:4},featureIcon:{fontSize:34,marginBottom:9},featureTitle:{fontSize:14,fontWeight:'800',color:C.text},featureSub:{fontSize:11,color:C.muted,marginTop:5},section:{backgroundColor:'rgba(19,30,46,0.72)',borderRadius:22,borderWidth:1,borderColor:'rgba(170,207,235,0.18)',padding:15,gap:13,shadowColor:'#000',shadowOpacity:.14,shadowRadius:14,elevation:4},sectionHead:{gap:3},sectionTitle:{fontSize:13,fontWeight:'900',letterSpacing:1.1,color:C.cyan},sectionSub:{fontSize:10,color:C.muted},emptyCard:{borderWidth:1,borderColor:'#2A3A4E',borderStyle:'dashed',borderRadius:16,padding:25,alignItems:'center',gap:7},emptyIcon:{fontSize:30,color:C.cyan},cardTitle:{fontSize:14,fontWeight:'800',color:C.text},recentRow:{flexDirection:'row',alignItems:'center',gap:12,padding:10,borderRadius:13,backgroundColor:C.panel2},recentThumb:{width:54,height:45,borderRadius:9,backgroundColor:'#09111B',alignItems:'center',justifyContent:'center'},note:{borderRadius:14,padding:14,backgroundColor:'#111B2A',borderLeftWidth:3,borderLeftColor:C.purple},noteTitle:{fontSize:11,fontWeight:'900',color:C.purple,letterSpacing:1},noteText:{fontSize:11,color:C.muted,lineHeight:17,marginTop:6},editorContent:{paddingHorizontal:14,paddingTop:14,paddingBottom:54,gap:13},editorTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},importButton:{borderWidth:1,borderColor:C.cyan,borderRadius:12,paddingHorizontal:14,paddingVertical:10},importText:{color:C.cyan,fontWeight:'800'},previewCard:{borderRadius:17,overflow:'hidden',borderWidth:1,borderColor:'#314357',backgroundColor:'#02060C'},video:{width:'100%',height:Math.min(250,Dimensions.get('window').width*.52),backgroundColor:'#000'},emptyPreview:{height:190,alignItems:'center',justifyContent:'center',gap:8},playIcon:{fontSize:42,color:C.cyan},previewFooter:{height:38,paddingHorizontal:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'#111B29'},previewName:{fontSize:11,color:C.text,flex:1},previewTag:{color:C.cyan,fontWeight:'900',fontSize:11},valueLine:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},value:{fontSize:16,fontWeight:'900',color:C.cyan},ruler:{gap:5,paddingVertical:4},fpsTick:{minWidth:39,height:40,paddingHorizontal:7,borderRadius:10,backgroundColor:'#202B3B',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#2C3B50'},fpsTickActive:{backgroundColor:'#0C5368',borderColor:C.cyan},fpsTickText:{fontSize:11,color:'#AAB6C8'},fpsTickTextActive:{fontWeight:'900',color:'#E9FCFF'},helper:{fontSize:10,color:C.muted,lineHeight:16},qualityRuler:{gap:8,paddingVertical:4},qualityChip:{minWidth:72,padding:10,borderRadius:11,backgroundColor:'#202B3B',alignItems:'center',borderWidth:1,borderColor:'#2C3B50'},qualityActive:{backgroundColor:'#0D5368',borderColor:C.cyan},qualityText:{fontSize:13,color:C.text,fontWeight:'800'},qualityTextActive:{color:'#E9FCFF'},qualityPixels:{fontSize:8,color:C.muted,marginTop:3},toggleRow:{minHeight:58,flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderColor:'#202D3E'},toggleTitle:{fontSize:13,fontWeight:'800',color:C.text},toggleSub:{fontSize:10,color:C.muted,marginTop:3},engineRow:{flexDirection:'row',alignItems:'center',gap:10,paddingVertical:9,borderBottomWidth:1,borderColor:'#202D3E'},engineName:{fontSize:12,fontWeight:'800',color:C.text},engineDetail:{fontSize:9,color:C.muted,marginTop:4},engineStatus:{fontSize:9,fontWeight:'800',color:C.warn,textAlign:'right'},actionRow:{flexDirection:'row',gap:10},resetButton:{padding:15,borderRadius:13,backgroundColor:'#1B2635',alignItems:'center',justifyContent:'center'},resetText:{color:C.text,fontWeight:'800'},exportButton:{flex:1,padding:15,borderRadius:13,backgroundColor:C.cyan,alignItems:'center',justifyContent:'center'},exportText:{color:'#04121A',fontWeight:'900',fontSize:12}
});
function QuickOptions({title,values,value,onChange,suffix}){return <View style={styles.quickWrap}><Text style={styles.quickTitle}>{title}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled contentContainerStyle={styles.quickList}>{values.map(v=><Pressable key={String(v)} onPress={()=>onChange(v)} style={[styles.quickChip,v===value&&styles.quickChipActive]}><Text style={[styles.quickChipText,v===value&&styles.quickChipTextActive]}>{v}{suffix?' '+suffix:''}</Text></Pressable>)}</ScrollView></View>;}
function WheelGauge({values,value,onChange,suffix}){const ref=React.useRef(null);const itemH=46;const viewportH=184;const selected=values.indexOf(value);const lastValue=React.useRef(value);const scrollToIndex=(i,animated=true)=>{if(ref.current&&i>=0)ref.current.scrollTo({y:i*itemH,animated});};useEffect(()=>{if(selected>=0&&lastValue.current!==value){lastValue.current=value;scrollToIndex(selected,true);}},[value]);useEffect(()=>{if(selected>=0){scrollToIndex(selected,false);lastValue.current=value;}},[]);const commit=e=>{const i=Math.max(0,Math.min(values.length-1,Math.round(e.nativeEvent.contentOffset.y/itemH)));const next=values[i];if(next!==undefined&&next!==value){lastValue.current=next;onChange(next);}};return <View style={styles.wheelShell}><View pointerEvents="none" style={styles.wheelTopGlow}/><View style={styles.wheelViewport}><ScrollView ref={ref} style={styles.wheelScroll} contentContainerStyle={styles.wheelContent} showsVerticalScrollIndicator={false} nestedScrollEnabled directionalLockEnabled decelerationRate="fast" snapToInterval={itemH} snapToAlignment="start" scrollEventThrottle={16} onMomentumScrollEnd={commit} onScrollEndDrag={e=>{if(!e.nativeEvent.velocity||Math.abs(e.nativeEvent.velocity.y)<0.05)commit(e);}} overScrollMode="never" bounces={false} alwaysBounceVertical={false}><View style={{height:(viewportH-itemH)/2}}/>{values.map((v,i)=><Pressable key={String(v)} onPress={()=>{lastValue.current=v;onChange(v);scrollToIndex(i,true);}} style={styles.wheelItem}><Text style={[styles.wheelItemText,v===value&&styles.wheelItemActive]}>{v}{suffix?' '+suffix:''}</Text></Pressable>)}<View style={{height:(viewportH-itemH)/2}}/></ScrollView><View pointerEvents="none" style={styles.wheelCenterBand}/><View pointerEvents="none" style={styles.wheelFadeTop}/><View pointerEvents="none" style={styles.wheelFadeBottom}/></View><View style={styles.wheelSide}><Text style={styles.wheelSideText}>FPS / QUALITY</Text><Text style={styles.wheelSideArrow}>⌃</Text><Text style={styles.wheelSideArrow}>⌄</Text></View><View style={styles.wheelValuePill}><Text style={styles.wheelValueText}>{value}{suffix?' '+suffix:''}</Text></View></View>;}
function largeFont(){return 28;}
