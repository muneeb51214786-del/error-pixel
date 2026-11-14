import React, {useMemo, useState} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  SafeAreaView, StatusBar, StyleSheet, useWindowDimensions
} from 'react-native';

const DARK = {
  bg: '#080B16', panel: '#12182A', glass: 'rgba(255,255,255,0.07)',
  text: '#F7F8FF', muted: '#9AA6C3', line: 'rgba(145,190,255,0.25)',
  blue: '#78DFFF', purple: '#B28AFF', input: '#182139'
};
const LIGHT = {
  bg: '#F2F5FC', panel: '#FFFFFF', glass: 'rgba(255,255,255,0.88)',
  text: '#171B2C', muted: '#707B96', line: 'rgba(95,125,190,0.23)',
  blue: '#278FD6', purple: '#8657D9', input: '#E9EEF8'
};
const GROUPS = {
  Edit: ['Import Media','Select','Trim','Cut','Split','Crop','Rotate','Flip','Reverse','Duplicate','Merge','Freeze Frame'],
  Speed: ['Speed','Speed Ramp','Time Remap','Frame Interpolation','Frame Blending','Optical Flow','AI Frame Generation'],
  Motion: ['Keyframe','Graph Editor','Curve Editor','Motion Blur','Motion Tracking','3D Tracking'],
  Color: ['Color Correction','Color Grading','LUTs','HSL','Curves','Brightness','Contrast','Exposure','Saturation','Sharpen','Blur'],
  Audio: ['Audio Extractor','Volume','Fade In','Fade Out','Equalizer','Noise Reduction','Vocal Remover','Auto Beat Sync'],
  Effects: ['Glitch','VHS','Glow','Film Grain','Lens Flare','Bokeh','Particles','Shake','Rain','Snow'],
  Text: ['Text','Auto Captions','Subtitles','Logo Animation','Titles','Motion Graphics'],
  AI: ['AI Video Enhancer','AI Quality Upscaler','FPS Booster','AI Background Removal','AI Denoiser','AI Object Removal']
};
const QUICK = [
  ['AI Video Enhancer','✦'],['Quality Upscaler','↗'],['FPS Booster','⚡'],
  ['AI Photo Enhancer','▧'],['Background Removal','✂'],['Color Grading','◉'],
  ['Auto Captions','▤'],['Audio Tools','♫']
];
const LEVELS = [
  ['Bronze I',20,'15 Days'],['Bronze II',25,'30 Days'],['Silver I',100,'2 Months'],
  ['Silver II',500,'6 Months'],['Gold I',2500,'1 Year'],['Gold II',30000,'18 Months'],
  ['Platinum',60000,'All Premium'],['Legendary',100000,'Legendary Benefits']
];

function Glass({children, style, C}) {
  return <View style={[styles.glass,{backgroundColor:C.glass,borderColor:C.line},style]}>{children}</View>;
}
function ActionButton({title, onPress, C, active=false, compact=false, icon}) {
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress}
      style={[styles.button,{backgroundColor:active?C.glass:C.panel,borderColor:active?C.blue:C.line},compact&&styles.compactButton]}>
      {icon ? <Text style={{color:C.blue,fontWeight:'900'}}>{icon}</Text> : null}
      <Text style={{color:C.text,fontSize:10,fontWeight:'900'}}>{title}</Text>
    </TouchableOpacity>
  );
}
function TopBar({title,C,onBack,onTheme,dark}) {
  return (
    <View style={[styles.topbar,{borderBottomColor:C.line}]}>
      <TouchableOpacity onPress={onBack} style={styles.back}><Text style={{color:C.blue,fontSize:26}}>‹</Text></TouchableOpacity>
      <View style={{flex:1}}>
        <Text style={{color:C.text,fontWeight:'900',fontSize:15,letterSpacing:1}}>{title}</Text>
        <Text style={{color:C.muted,fontSize:8,letterSpacing:1.5,marginTop:3}}>ERROR PIXEL CREATIVE STUDIO</Text>
      </View>
      <TouchableOpacity onPress={onTheme} style={[styles.theme,{borderColor:C.line}]}><Text>{dark?'☀':'☾'}</Text></TouchableOpacity>
    </View>
  );
}

function App() {
  const {width,height} = useWindowDimensions();
  const landscape = width > height && width > 650;
  const [dark,setDark] = useState(true);
  const C = dark ? DARK : LIGHT;
  const [page,setPage] = useState('welcome');
  const [group,setGroup] = useState('Edit');
  const [tool,setTool] = useState('Select');
  const [query,setQuery] = useState('');
  const [projectName,setProjectName] = useState('Untitled Project');
  const [projects,setProjects] = useState([]);
  const [photoProjects,setPhotoProjects] = useState([]);
  const [tracks,setTracks] = useState(8);
  const [clips,setClips] = useState(2);
  const [playing,setPlaying] = useState(false);
  const [resolution,setResolution] = useState('1080p');
  const [fps,setFps] = useState('60 FPS');
  const [notice,setNotice] = useState('Ready to create');
  const [photoName,setPhotoName] = useState('');

  const filteredTools = useMemo(
    () => (GROUPS[group]||[]).filter(x=>x.toLowerCase().includes(query.toLowerCase())),
    [group,query]
  );

  const go = name => {
    setPage(name);
    setNotice(name+' opened');
  };
  const startVideo = () => {
    setProjectName('Untitled Project');
    setTool('Select');
    setGroup('Edit');
    go('editor');
  };
  const saveVideo = () => {
    setProjects(old=>[...old,{name:projectName,date:new Date().toLocaleDateString()}]);
    setNotice('Project saved in this session');
  };
  const selectTool = name => {
    setTool(name);
    setNotice(name+' selected');
    if(name==='Split') setClips(v=>v+1);
    if(name==='Export') go('export');
  };

  const Header = ({title}) => (
    <TopBar title={title} C={C} onBack={()=>go('home')} onTheme={()=>setDark(v=>!v)} dark={dark}/>
  );

  const Section = ({title,action,onPress}) => (
    <View style={styles.sectionHead}>
      <Text style={{color:C.text,fontWeight:'900',fontSize:13,letterSpacing:.6}}>{title}</Text>
      {action ? <TouchableOpacity onPress={onPress}><Text style={{color:C.blue,fontSize:10,fontWeight:'900'}}>{action} ›</Text></TouchableOpacity> : null}
    </View>
  );

  const Preview = () => (
    <Glass C={C} style={styles.preview}>
      <View style={styles.between}>
        <Text style={{color:C.blue,fontSize:9,fontWeight:'900'}}>PREVIEW MONITOR</Text>
        <Text style={{color:C.muted,fontSize:9}}>{resolution} · {fps}</Text>
      </View>
      <View style={styles.canvas}>
        <Text style={{fontSize:42,color:C.blue,fontWeight:'900'}}>EP</Text>
        <Text style={{color:'#FFF',fontSize:16,fontWeight:'900',letterSpacing:3}}>ERROR PIXEL</Text>
        <Text style={{color:'#C5C9E8',fontSize:9,marginTop:5}}>VIDEO PREVIEW AREA</Text>
      </View>
      <View style={[styles.between,{marginTop:8}]}>
        <ActionButton title="UNDO" C={C} compact onPress={()=>setNotice('Undo selected')}/>
        <ActionButton title={playing?'PAUSE':'PLAY'} icon={playing?'Ⅱ':'▶'} C={C} active compact onPress={()=>setPlaying(v=>!v)}/>
        <ActionButton title="REDO" C={C} compact onPress={()=>setNotice('Redo selected')}/>
        <ActionButton title="KEYFRAME" C={C} compact onPress={()=>setNotice('Keyframe added')}/>
      </View>
    </Glass>
  );

  const Timeline = () => (
    <Glass C={C} style={[styles.timeline,landscape&&styles.landscapeTimeline]}>
      <View style={styles.between}>
        <View>
          <Text style={{color:C.blue,fontSize:9,fontWeight:'900'}}>MULTI TRACK SEQUENCE</Text>
          <Text style={{color:C.text,fontSize:13,fontWeight:'900',marginTop:4}}>Timeline</Text>
        </View>
        <TouchableOpacity onPress={()=>setTracks(v=>Math.min(v+1,20))}>
          <Text style={{color:C.blue,fontWeight:'900'}}>＋ TRACK</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={{minWidth:720}}>
          <View style={styles.ruler}>
            {['00:00','00:03','00:06','00:09','00:12','00:15','00:18','00:21'].map(t=>
              <Text key={t} style={{color:C.muted,fontSize:9}}>{t}</Text>
            )}
          </View>
          <ScrollView style={{maxHeight:landscape?210:155}} nestedScrollEnabled>
            {Array.from({length:tracks},(_,i)=>i).map(i=>(
              <View key={i} style={styles.trackRow}>
                <Text style={{color:C.text,width:88,fontSize:8,fontWeight:'900',paddingHorizontal:7}}>
                  {['VIDEO 01','AUDIO','OVERLAY','EFFECTS','TEXT','VIDEO 02','VOICEOVER','MUSIC','CAPTIONS','GRAPHICS','MASK','ADJUSTMENT'][i%12]}
                </Text>
                <View style={{flex:1,paddingHorizontal:5}}>
                  <TouchableOpacity onPress={()=>setNotice('Track '+(i+1)+' selected')}
                    style={[styles.clip,{width:Math.min(125+clips*30,350),backgroundColor:i%2?'#6551A4':'#278EAD'}]}>
                    <Text style={{color:'#FFF',fontSize:8,fontWeight:'900'}}>{i===0?'VIDEO CLIP':'LAYER '+(i+1)}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </Glass>
  );

  if(page==='welcome') return (
    <SafeAreaView style={[styles.safe,{backgroundColor:C.bg}]}>
      <StatusBar barStyle={dark?'light-content':'dark-content'}/>
      <View style={styles.welcome}>
        <Glass C={C} style={styles.welcomeCard}>
          <View style={[styles.logo,{borderColor:C.blue}]}>
            <Text style={{color:C.blue,fontSize:38,fontWeight:'900'}}>EP</Text>
          </View>
          <Text style={{color:C.text,fontSize:27,fontWeight:'900',letterSpacing:2}}>
            ERROR <Text style={{color:C.blue}}>PIXEL</Text>
          </Text>
          <Text style={{color:C.purple,fontSize:9,fontWeight:'900',letterSpacing:2,marginTop:8}}>PROFESSIONAL CREATIVE STUDIO</Text>
          <Text style={{color:C.text,fontSize:19,fontWeight:'900',marginTop:32}}>CREATE WITHOUT LIMITS.</Text>
          <Text style={{color:C.muted,fontSize:11,marginTop:9,textAlign:'center'}}>Video · Photo · Motion · AI · Creator Studio</Text>
          <ActionButton title="GET STARTED" icon="✦" active C={C} onPress={()=>go('home')}/>
          <TouchableOpacity onPress={()=>setDark(v=>!v)} style={{marginTop:18}}>
            <Text style={{color:C.blue,fontSize:11,fontWeight:'900'}}>SWITCH TO {dark?'WHITE':'DARK'} MODE</Text>
          </TouchableOpacity>
        </Glass>
        <Text style={{color:C.muted,fontSize:9,letterSpacing:2,marginTop:20}}>YOUR VISION. YOUR CREATION.</Text>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={[styles.safe,{backgroundColor:C.bg}]}>
      <StatusBar barStyle={dark?'light-content':'dark-content'}/>

      {page==='home' && <ScrollView contentContainerStyle={{paddingBottom:28}}>
        <View style={styles.homeTop}>
          <View style={{flex:1}}>
            <Text style={{color:C.text,fontSize:24,fontWeight:'900',letterSpacing:2}}>ERROR <Text style={{color:C.blue}}>PIXEL</Text></Text>
            <Text style={{color:C.muted,fontSize:8,letterSpacing:1.5}}>PRO CREATIVE WORKSPACE</Text>
          </View>
          <TouchableOpacity onPress={()=>setDark(v=>!v)} style={[styles.theme,{borderColor:C.line}]}>
            <Text>{dark?'☀':'☾'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>go('settings')} style={[styles.theme,{borderColor:C.line}]}>
            <Text style={{color:C.blue}}>⚙</Text>
          </TouchableOpacity>
        </View>

        <View style={{paddingHorizontal:17,paddingTop:22,paddingBottom:14}}>
          <Text style={{color:C.blue,fontSize:9,fontWeight:'900',letterSpacing:1.5}}>WELCOME BACK, CREATOR</Text>
          <Text style={{color:C.text,fontSize:29,fontWeight:'900',marginTop:8}}>Make Something</Text>
          <Text style={{color:C.purple,fontSize:29,fontWeight:'900'}}>Extraordinary.</Text>
          <Text style={{color:C.muted,fontSize:11,marginTop:6}}>Your creative world starts here.</Text>
        </View>

        <Section title="FEATURED CREATIVE SHOWCASE" action="EXPLORE" onPress={()=>go('templates')}/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:15,gap:10}}>
          {[['CINEMATIC EDIT','🎬','#192C4D'],['VELOCITY PACK','⚡','#302047'],['AI CREATIVE LAB','✦','#163B49']].map(([t,ic,bg])=>(
            <TouchableOpacity key={t} onPress={()=>go('templates')} style={[styles.feature,{backgroundColor:bg,borderColor:C.line}]}>
              <Text style={{fontSize:32}}>{ic}</Text>
              <Text style={{color:'#FFF',fontWeight:'900',fontSize:13,marginTop:12}}>{t}</Text>
              <Text style={{color:'#D5D9F1',fontSize:9,marginTop:5}}>CREATIVE COLLECTION</Text>
              <Text style={{color:'#8FE5FF',fontSize:10,marginTop:12}}>EXPLORE ↗</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Section title="START CREATING"/>
        <View style={styles.createRow}>
          <TouchableOpacity onPress={startVideo} style={[styles.createCard,{borderColor:C.blue}]}>
            <Text style={{fontSize:28,color:C.blue}}>▶</Text>
            <Text style={{color:C.text,fontWeight:'900',marginTop:8}}>NEW VIDEO</Text>
            <Text style={{color:C.muted,fontSize:9,marginTop:4}}>Professional video editor</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>go('photo')} style={[styles.createCard,{borderColor:C.purple}]}>
            <Text style={{fontSize:28,color:C.purple}}>▧</Text>
            <Text style={{color:C.text,fontWeight:'900',marginTop:8}}>EDIT PHOTO</Text>
            <Text style={{color:C.muted,fontSize:9,marginTop:4}}>Separate photo studio</Text>
          </TouchableOpacity>
        </View>

        <Section title="QUICK TOOLS" action="OPEN EDITOR" onPress={startVideo}/>
        <View style={styles.quickGrid}>
          {QUICK.map(([name,ic])=>(
            <TouchableOpacity key={name} onPress={()=>{setTool(name);go('editor');}} style={[styles.quickCard,{backgroundColor:C.glass,borderColor:C.line}]}>
              <Text style={{color:C.blue,fontSize:22}}>{ic}</Text>
              <Text style={{color:C.text,fontSize:10,fontWeight:'800',marginTop:6}}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Section title="RECENT VIDEO PROJECTS" action="VIEW ALL" onPress={()=>go('projects')}/>
        {projects.length===0 ? (
          <Glass C={C} style={styles.empty}>
            <Text style={{color:C.purple,fontSize:27}}>▣</Text>
            <Text style={{color:C.text,fontWeight:'900',marginTop:8}}>No saved projects yet</Text>
            <Text style={{color:C.muted,fontSize:10,marginTop:5}}>Create a project to see it here.</Text>
          </Glass>
        ) : projects.slice(-4).reverse().map((p,i)=>(
          <TouchableOpacity key={i} onPress={startVideo} style={[styles.projectRow,{backgroundColor:C.glass,borderColor:C.line}]}>
            <Text style={{fontSize:23}}>🎬</Text>
            <View style={{flex:1}}>
              <Text style={{color:C.text,fontWeight:'900'}}>{p.name}</Text>
              <Text style={{color:C.muted,fontSize:9}}>{p.date}</Text>
            </View>
            <Text style={{color:C.blue}}>OPEN ›</Text>
          </TouchableOpacity>
        ))}

        <Section title="CREATOR ECOSYSTEM"/>
        {[['Templates','▧','templates'],['Effects Library','✦','effects'],['Creator Studio','♛','creator'],['Cloud Projects','☁','cloud'],['AI Tool Center','✧','ai'],['Settings','⚙','settings']].map(([name,ic,target])=>(
          <TouchableOpacity key={name} onPress={()=>go(target)} style={[styles.ecoRow,{backgroundColor:C.glass,borderColor:C.line}]}>
            <Text style={{color:C.blue,fontSize:23,width:35}}>{ic}</Text>
            <Text style={{color:C.text,fontWeight:'800',flex:1}}>{name}</Text>
            <Text style={{color:C.purple,fontSize:22}}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>}

      {page==='editor' && <View style={{flex:1,minHeight:0}}>
        <Header title="VIDEO EDITOR"/>
        <View style={[styles.editorBar,{borderColor:C.line}]}>
          <TextInput value={projectName} onChangeText={setProjectName} placeholder="Project name" placeholderTextColor={C.muted} style={[styles.projectInput,{color:C.text,backgroundColor:C.input,borderColor:C.line}]}/>
          <ActionButton title="SAVE" C={C} compact onPress={saveVideo}/>
          <ActionButton title="EXPORT" C={C} compact onPress={()=>go('export')}/>
        </View>

        {landscape ? (
          <View style={{flex:1,minHeight:0}}>
            <View style={styles.landscapeArea}>
              <Glass C={C} style={[styles.library,{width:180}]}>
                <Text style={{color:C.blue,fontSize:9,fontWeight:'900'}}>TOOL LIBRARY</Text>
                <TextInput value={query} onChangeText={setQuery} placeholder="Search tools" placeholderTextColor={C.muted} style={[styles.search,{color:C.text,backgroundColor:C.input,borderColor:C.line}]}/>
                <ScrollView>
                  {Object.keys(GROUPS).map(g=>(
                    <ActionButton key={g} title={g} C={C} active={group===g} compact onPress={()=>setGroup(g)}/>
                  ))}
                  <View style={styles.toolsWrap}>
                    {filteredTools.map(t=>(
                      <ActionButton key={t} title={t} C={C} active={tool===t} compact onPress={()=>selectTool(t)}/>
                    ))}
                  </View>
                </ScrollView>
              </Glass>

              <View style={{flex:1,minWidth:0,gap:7}}>
                <Preview/>
                <Glass C={C} style={{flex:1,minHeight:0,padding:10}}>
                  <Text style={{color:C.blue,fontSize:9,fontWeight:'900'}}>SELECTED TOOL</Text>
                  <Text style={{color:C.text,fontSize:20,fontWeight:'900',marginTop:8}}>{tool}</Text>
                  <Text style={{color:C.muted,fontSize:10,marginTop:7}}>{notice}</Text>
                  <View style={styles.toolsWrap}>
                    {['Apply','Adjust','Reset','Add Keyframe','Open Settings'].map(x=>(
                      <ActionButton key={x} title={x} C={C} compact onPress={()=>setNotice(x+' · '+tool)}/>
                    ))}
                  </View>
                </Glass>
              </View>

              <Glass C={C} style={[styles.inspector,{width:165}]}>
                <Text style={{color:C.blue,fontSize:9,fontWeight:'900'}}>INSPECTOR</Text>
                <Text style={{color:C.text,fontWeight:'900',marginTop:12}}>Resolution</Text>
                {['720p','1080p','2K','4K','8K'].map(x=>(
                  <ActionButton key={x} title={x} C={C} active={resolution===x} compact onPress={()=>setResolution(x)}/>
                ))}
                <Text style={{color:C.text,fontWeight:'900',marginTop:12}}>Frame Rate</Text>
                {['30 FPS','60 FPS','120 FPS','240 FPS'].map(x=>(
                  <ActionButton key={x} title={x} C={C} active={fps===x} compact onPress={()=>setFps(x)}/>
                ))}
              </Glass>
            </View>
            <Timeline/>
          </View>
        ) : (
          <ScrollView keyboardShouldPersistTaps="handled">
            <Preview/>
            <Timeline/>
            <Glass C={C} style={{margin:8,padding:10}}>
              <Text style={{color:C.blue,fontSize:9,fontWeight:'900'}}>TOOL SEARCH</Text>
              <TextInput value={query} onChangeText={setQuery} placeholder="Search editing tools" placeholderTextColor={C.muted} style={[styles.search,{color:C.text,backgroundColor:C.input,borderColor:C.line}]}/>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {Object.keys(GROUPS).map(g=>(
                  <ActionButton key={g} title={g} C={C} active={group===g} compact onPress={()=>setGroup(g)}/>
                ))}
              </ScrollView>
              <View style={styles.toolsWrap}>
                {filteredTools.map(t=>(
                  <ActionButton key={t} title={t} C={C} active={tool===t} compact onPress={()=>selectTool(t)}/>
                ))}
              </View>
            </Glass>
            <Glass C={C} style={{margin:8,padding:10}}>
              <Text style={{color:C.blue,fontSize:9,fontWeight:'900'}}>IMPORT MEDIA</Text>
              <ActionButton title="＋ IMPORT VIDEO / PHOTO" C={C} onPress={()=>setNotice('Media picker integration required')}/>
              <Text style={{color:C.muted,fontSize:9,marginTop:8}}>{notice}</Text>
            </Glass>
          </ScrollView>
        )}
      </View>}

      {page==='photo' && <View style={{flex:1}}>
        <Header title="PHOTO STUDIO"/>
        <ScrollView contentContainerStyle={{padding:14}}>
          <Glass C={C} style={styles.photoCanvas}>
            <Text style={{fontSize:45,color:C.purple}}>▧</Text>
            <Text style={{color:C.text,fontSize:22,fontWeight:'900'}}>PHOTO EDITOR</Text>
            <Text style={{color:C.muted,fontSize:10}}>Independent photo workspace</Text>
            <ActionButton title="＋ IMPORT PHOTO" C={C} onPress={()=>setNotice('Photo picker integration required')}/>
          </Glass>
          <Section title="PHOTO TOOLS"/>
          <View style={styles.quickGrid}>
            {[...GROUPS.Color,...GROUPS.AI].map(t=>(
              <TouchableOpacity key={t} onPress={()=>setNotice(t+' selected')} style={[styles.quickCard,{backgroundColor:C.glass,borderColor:C.line}]}>
                <Text style={{color:C.blue,fontSize:18}}>◇</Text>
                <Text style={{color:C.text,fontSize:10,fontWeight:'800'}}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput value={photoName} onChangeText={setPhotoName} placeholder="Photo project name" placeholderTextColor={C.muted} style={[styles.search,{color:C.text,backgroundColor:C.input,borderColor:C.line}]}/>
          <ActionButton title="SAVE PHOTO PROJECT" C={C} onPress={()=>{
            setPhotoProjects(v=>[...v,photoName||'Photo Project '+(v.length+1)]);
            setNotice('Photo project saved in session');
          }}/>
          <Text style={{color:C.muted,fontSize:10,marginTop:10}}>{notice}</Text>
        </ScrollView>
      </View>}

      {page==='projects' && <View style={{flex:1}}>
        <Header title="MY PROJECTS"/>
        <ScrollView contentContainerStyle={{padding:14}}>
          <Section title="VIDEO PROJECTS"/>
          {projects.length===0 ? <Text style={{color:C.muted}}>No video projects saved yet.</Text> : projects.map((p,i)=>(
            <TouchableOpacity key={i} onPress={startVideo} style={[styles.projectRow,{backgroundColor:C.glass,borderColor:C.line}]}>
              <Text style={{color:C.text,flex:1}}>{p.name}</Text>
              <Text style={{color:C.blue}}>OPEN</Text>
            </TouchableOpacity>
          ))}
          <Section title="PHOTO PROJECTS"/>
          {photoProjects.map((p,i)=><Text key={i} style={{color:C.text,padding:10}}>{p}</Text>)}
          <ActionButton title="＋ NEW VIDEO PROJECT" C={C} onPress={startVideo}/>
        </ScrollView>
      </View>}

      {['templates','effects','ai','creator','cloud','settings','export'].includes(page) && (
        <View style={{flex:1}}>
          <Header title={{templates:'TEMPLATES',effects:'EFFECTS LIBRARY',ai:'AI TOOL CENTER',creator:'CREATOR STUDIO',cloud:'CLOUD PROJECTS',settings:'SETTINGS',export:'EXPORT SETTINGS'}[page]}/>
          <ScrollView contentContainerStyle={{padding:14}}>
            {page==='settings' && <>
              <Glass C={C} style={styles.setting}>
                <Text style={{color:C.text,fontWeight:'900'}}>APPEARANCE</Text>
                <Text style={{color:C.muted,fontSize:10,marginTop:5}}>Choose your interface theme.</Text>
                <View style={styles.createRow}>
                  <ActionButton title="DARK MODE" C={C} active={dark} onPress={()=>setDark(true)}/>
                  <ActionButton title="WHITE MODE" C={C} active={!dark} onPress={()=>setDark(false)}/>
                </View>
              </Glass>
              <Glass C={C} style={styles.setting}>
                <Text style={{color:C.text,fontWeight:'900'}}>ABOUT ERROR PIXEL</Text>
                <Text style={{color:C.muted,fontSize:10,marginTop:6}}>Liquid Glass inspired interface · Purple + Sky Blue</Text>
              </Glass>
            </>}

            {page==='export' && <Glass C={C} style={styles.setting}>
              <Text style={{color:C.text,fontWeight:'900'}}>RESOLUTION</Text>
              <View style={styles.toolsWrap}>
                {['144p','240p','360p','480p','720p HD','1080p','2K','4K','5K','6K','8K','12K','16K'].map(x=>(
                  <ActionButton key={x} title={x} C={C} active={resolution===x} compact onPress={()=>setResolution(x)}/>
                ))}
              </View>
              <Text style={{color:C.text,fontWeight:'900',marginTop:16}}>FRAME RATE</Text>
              <View style={styles.toolsWrap}>
                {['24 FPS','30 FPS','60 FPS','90 FPS','120 FPS','240 FPS','480 FPS','960 FPS'].map(x=>(
                  <ActionButton key={x} title={x} C={C} active={fps===x} compact onPress={()=>setFps(x)}/>
                ))}
              </View>
              <ActionButton title="CONFIRM EXPORT SETTINGS" C={C} onPress={()=>setNotice('A real rendering engine is required to export video')}/>
              <Text style={{color:C.muted,fontSize:10,marginTop:8}}>{notice}</Text>
            </Glass>}

            {page==='templates' && <>
              <Text style={{color:C.text,fontSize:23,fontWeight:'900'}}>Creator Templates</Text>
              <Text style={{color:C.muted,fontSize:10,marginTop:5}}>Discover and manage creative templates.</Text>
              <ActionButton title="＋ UPLOAD TEMPLATE" C={C} onPress={()=>setNotice('Template upload requires backend storage')}/>
              {['Cinematic Pack','Velocity Transitions','Neon Intro','Cricket Edit Pack'].map(x=>(
                <Glass key={x} C={C} style={styles.listCard}>
                  <Text style={{color:C.text,fontWeight:'900'}}>{x}</Text>
                  <ActionButton title="PREVIEW" C={C} compact onPress={()=>setNotice(x+' preview selected')}/>
                </Glass>
              ))}
            </>}

            {page==='effects' && <>
              <Text style={{color:C.text,fontSize:23,fontWeight:'900'}}>Community Effects</Text>
              <ActionButton title="＋ CREATE EFFECT" C={C} onPress={()=>setNotice('Effect publishing requires backend')}/>
              {['Neon Glow','Motion Blur','RGB Split','Cinematic Shake','Crystal Light'].map(x=>(
                <Glass key={x} C={C} style={styles.listCard}>
                  <Text style={{color:C.text,fontWeight:'900'}}>{x}</Text>
                  <ActionButton title="USE EFFECT" C={C} compact onPress={()=>{setTool(x);go('editor');}}/>
                </Glass>
              ))}
            </>}

            {page==='ai' && QUICK.map(([name,ic])=>(
              <Glass key={name} C={C} style={styles.listCard}>
                <Text style={{color:C.text,fontWeight:'900'}}>{ic} {name}</Text>
                <ActionButton title="OPEN TOOL" C={C} compact onPress={()=>{setTool(name);go('editor');}}/>
              </Glass>
            ))}

            {page==='creator' && <>
              <Glass C={C} style={styles.setting}>
                <Text style={{color:C.blue,fontSize:9,fontWeight:'900'}}>CREATOR PROFILE</Text>
                <Text style={{color:C.purple,fontSize:25,fontWeight:'900',marginTop:8}}>♛ LEGENDARY</Text>
                <Text style={{color:C.text,fontSize:11,marginTop:8}}>Creator ID: EP-OWNER-0001</Text>
                <Text style={{color:C.blue,fontWeight:'900',marginTop:7}}>100,000 CREATOR POINTS</Text>
              </Glass>
              <Section title="CREATOR LEVELS"/>
              {LEVELS.map((x,i)=>(
                <Glass key={x[0]} C={C} style={styles.listCard}>
                  <Text style={{color:C.text,fontWeight:'900'}}>LEVEL {i+1} · {x[0]}</Text>
                  <Text style={{color:C.muted,fontSize:10,marginTop:4}}>{x[1].toLocaleString()} Points · Reward: {x[2]}</Text>
                </Glass>
              ))}
              <ActionButton title="APPLY AS TEMPLATE CREATOR" C={C} onPress={()=>setNotice('Creator application requires account verification')}/>
            </>}

            {page==='cloud' && <Glass C={C} style={styles.setting}>
              <Text style={{color:C.text,fontSize:22,fontWeight:'900'}}>Cloud Projects</Text>
              <Text style={{color:C.muted,fontSize:10,marginTop:8}}>Cloud sync requires a connected backend such as Supabase.</Text>
              <ActionButton title="CHECK CLOUD CONNECTION" C={C} onPress={()=>setNotice('Cloud backend is not connected yet')}/>
              <Text style={{color:C.muted,fontSize:10,marginTop:8}}>{notice}</Text>
            </Glass>}
          </ScrollView>
        </View>
      )}

      {!(page==='editor' && landscape) && (
        <View style={[styles.bottomNav,{backgroundColor:C.panel,borderColor:C.line}]}>
          {[['Home','⌂','home'],['Projects','▣','projects'],['Create','＋','editor'],['Templates','▧','templates'],['Profile','♙','creator']].map(([name,ic,target])=>(
            <TouchableOpacity key={name} onPress={()=>target==='editor'?startVideo():go(target)} style={styles.navItem}>
              <Text style={{color:page===target?C.blue:C.muted,fontSize:20}}>{ic}</Text>
              <Text style={{color:page===target?C.blue:C.muted,fontSize:9,fontWeight:'800'}}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1},
  glass:{borderWidth:1,borderRadius:19,padding:12,shadowColor:'#7C9CFF',shadowOpacity:0.15,shadowRadius:14,elevation:6},
  topbar:{minHeight:62,paddingHorizontal:12,flexDirection:'row',alignItems:'center',borderBottomWidth:1,gap:9},
  back:{width:30,alignItems:'center'},
  theme:{width:40,height:40,borderRadius:14,borderWidth:1,alignItems:'center',justifyContent:'center'},
  button:{minHeight:38,borderRadius:12,borderWidth:1,paddingHorizontal:11,paddingVertical:8,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,marginTop:7},
  compactButton:{minHeight:30,paddingHorizontal:8,paddingVertical:5},
  welcome:{flex:1,alignItems:'center',justifyContent:'center',padding:20},
  welcomeCard:{width:'100%',maxWidth:470,alignItems:'center',paddingVertical:38,paddingHorizontal:20,borderRadius:30},
  logo:{width:96,height:96,borderRadius:32,borderWidth:2,backgroundColor:'rgba(100,170,255,0.12)',alignItems:'center',justifyContent:'center',marginBottom:22},
  homeTop:{minHeight:65,paddingHorizontal:14,flexDirection:'row',alignItems:'center',gap:8},
  sectionHead:{marginHorizontal:15,marginTop:20,marginBottom:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  feature:{width:235,height:150,borderRadius:20,borderWidth:1,padding:16,justifyContent:'center'},
  createRow:{flexDirection:'row',gap:9,marginHorizontal:14,marginTop:5},
  createCard:{flex:1,minHeight:120,borderRadius:18,borderWidth:1,backgroundColor:'rgba(255,255,255,0.05)',padding:13,justifyContent:'center'},
  quickGrid:{flexDirection:'row',flexWrap:'wrap',gap:8,marginHorizontal:14},
  quickCard:{width:'48%',minHeight:75,borderWidth:1,borderRadius:15,padding:11,justifyContent:'center'},
  empty:{marginHorizontal:14,alignItems:'center',padding:20},
  projectRow:{marginHorizontal:14,marginBottom:8,padding:12,borderRadius:14,borderWidth:1,flexDirection:'row',alignItems:'center',gap:10},
  ecoRow:{marginHorizontal:14,marginBottom:7,padding:12,borderRadius:15,borderWidth:1,flexDirection:'row',alignItems:'center',gap:10},
  editorBar:{flexDirection:'row',alignItems:'center',gap:5,padding:7,borderBottomWidth:1},
  projectInput:{flex:1,minWidth:70,borderWidth:1,borderRadius:10,paddingHorizontal:9,paddingVertical:8,fontSize:10},
  landscapeArea:{flex:1,minHeight:0,flexDirection:'row',padding:6,gap:6},
  library:{padding:8},
  inspector:{padding:8},
  search:{borderWidth:1,borderRadius:9,padding:8,fontSize:10,marginVertical:7},
  toolsWrap:{flexDirection:'row',flexWrap:'wrap',gap:5,marginTop:7},
  preview:{margin:7,padding:9},
  between:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  canvas:{height:150,marginTop:8,borderRadius:13,backgroundColor:'#11172A',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'rgba(120,210,255,0.3)'},
  timeline:{margin:7,padding:9},
  landscapeTimeline:{flexShrink:0},
  ruler:{height:25,flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingLeft:90},
  trackRow:{height:28,flexDirection:'row',alignItems:'center',marginBottom:3,backgroundColor:'rgba(130,150,200,0.08)',borderRadius:7,overflow:'hidden'},
  clip:{height:21,borderRadius:6,justifyContent:'center',paddingHorizontal:7},
  photoCanvas:{minHeight:220,alignItems:'center',justifyContent:'center',gap:8},
  setting:{marginBottom:12,padding:14},
  listCard:{marginBottom:9,gap:6},
  bottomNav:{height:59,borderTopWidth:1,flexDirection:'row',alignItems:'center',justifyContent:'space-around'},
  navItem:{flex:1,alignItems:'center',justifyContent:'center',gap:2}
});
