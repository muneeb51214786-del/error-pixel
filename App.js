
import React, {useState} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  SafeAreaView, StatusBar, StyleSheet, useWindowDimensions
} from 'react-native';

const DARK = {
  bg:'#080B16', panel:'rgba(27,32,54,0.82)',
  glass:'rgba(255,255,255,0.075)', glass2:'rgba(115,155,255,0.12)',
  text:'#F7F8FF', muted:'#929DB9', line:'rgba(155,190,255,0.22)',
  blue:'#78DFFF', purple:'#B28AFF', pink:'#E4A4FF',
  input:'#151B2D', shadow:'#11172B'
};

const LIGHT = {
  bg:'#F2F5FC', panel:'rgba(255,255,255,0.88)',
  glass:'rgba(255,255,255,0.78)', glass2:'rgba(112,157,255,0.12)',
  text:'#171B2C', muted:'#707B96', line:'rgba(95,125,190,0.22)',
  blue:'#278FD6', purple:'#8657D9', pink:'#B66DD9',
  input:'#E9EEF8', shadow:'#DCE4F5'
};

const TOOL_GROUPS = {
  Edit:['Select','Import Media','Trim','Cut','Split','Crop','Rotate','Flip','Reverse','Duplicate','Merge','Delete','Freeze Frame'],
  Speed:['Speed','Speed Ramp','Time Remap','Frame Interpolation','Frame Blending','Optical Flow'],
  Motion:['Keyframe','Graph Editor','Curve Editor','Motion Blur','Motion Tracking','3D Tracking'],
  Color:['Color Correction','Color Grading','LUTs','HSL','Curves','Brightness','Contrast','Exposure','Saturation','Sharpen','Blur'],
  Audio:['Audio Extractor','Volume','Fade In','Fade Out','Equalizer','Noise Reduction','Vocal Remover','Auto Beat Sync'],
  Effects:['Glitch','VHS','Glow','Film Grain','Lens Flare','Bokeh','Particles','Shake','Rain','Snow'],
  Text:['Text','Auto Captions','Subtitles','Logo Animation','Titles','Motion Graphics'],
  AI:['AI Video Enhancer','AI Quality Upscaler','FPS Booster','AI Background Removal','AI Denoiser','AI Object Removal'],
  Export:['Resolution','Frame Rate','Format','Bitrate','Export']
};

const QUICK = [
  ['AI Video Enhancer','✦'],['Quality Upscaler','↗'],
  ['FPS Booster','⚡'],['AI Photo Enhancer','▧'],
  ['Background Removal','✂'],['Color Grading','◉'],
  ['Auto Captions','▤'],['Audio Tools','♫']
];

const LEVELS = [
  ['Bronze I',20,'15 Days'],['Bronze II',25,'30 Days'],
  ['Silver I',100,'2 Months'],['Silver II',500,'6 Months'],
  ['Gold I',2500,'1 Year'],['Gold II',30000,'18 Months'],
  ['Platinum',60000,'All Premium'],['Legendary',100000,'Legendary Benefits']
];

export default function App() {
  const {width,height} = useWindowDimensions();
  const landscape = width > height && width > 650;
  const [dark,setDark] = useState(true);
  const C = dark ? DARK : LIGHT;
  const [page,setPage] = useState('welcome');
  const [tool,setTool] = useState('Select');
  const [group,setGroup] = useState('Edit');
  const [search,setSearch] = useState('');
  const [mediaSearch,setMediaSearch] = useState('');
  const [projectName,setProjectName] = useState('Untitled Project');
  const [projects,setProjects] = useState([]);
  const [photoProjects,setPhotoProjects] = useState([]);
  const [tracks,setTracks] = useState(8);
  const [clips,setClips] = useState(2);
  const [playing,setPlaying] = useState(false);
  const [message,setMessage] = useState('Ready to create');
  const [fps,setFps] = useState('60 FPS');
  const [resolution,setResolution] = useState('1080p');
  const [tab,setTab] = useState('Home');
  const [welcomeDone,setWelcomeDone] = useState(false);
  const [creatorId] = useState('EP-OWNER-0001');
  const [creatorPoints] = useState(100000);

  const go = p => {
    setPage(p);
    setMessage(p+' opened');
  };

  const chooseTool = name => {
    setTool(name);
    setMessage(name+' selected');
    if(name==='Split') setClips(v=>v+1);
    if(name==='Import Media') setMessage('Media picker connection required');
    if(name==='Export') go('export');
  };

  const Glass = ({children,style}) => (
    <View style={[s.glass,{backgroundColor:C.glass,borderColor:C.line},style]}>
      {children}
    </View>
  );

  const Button = ({title,icon,onPress,active,small}) => (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        s.button,
        {backgroundColor:active?C.glass2:C.glass,borderColor:active?C.blue:C.line},
        small&&s.smallButton
      ]}>
      {icon ? <Text style={[s.buttonIcon,{color:C.blue}]}>{icon}</Text> : null}
      <Text style={[s.buttonText,{color:C.text}]}>{title}</Text>
    </TouchableOpacity>
  );

  const Header = ({title,back=true}) => (
    <View style={[s.header,{borderBottomColor:C.line}]}>
      <TouchableOpacity onPress={()=>go('home')} style={s.backButton}>
        <Text style={{color:C.blue,fontSize:25}}>‹</Text>
      </TouchableOpacity>
      <View style={{flex:1}}>
        <Text style={[s.headerTitle,{color:C.text}]}>{title}</Text>
        <Text style={[s.headerSub,{color:C.muted}]}>ERROR PIXEL CREATIVE STUDIO</Text>
      </View>
      <TouchableOpacity onPress={()=>setDark(v=>!v)} style={[s.themeButton,{borderColor:C.line,backgroundColor:C.glass}]}>
        <Text style={{fontSize:18}}>{dark?'☀':'☾'}</Text>
      </TouchableOpacity>
    </View>
  );

  const Section = ({title,action,onPress}) => (
    <View style={s.sectionHead}>
      <Text style={[s.sectionTitle,{color:C.text}]}>{title}</Text>
      {action ? <TouchableOpacity onPress={onPress}>
        <Text style={{color:C.blue,fontSize:10,fontWeight:'900'}}>{action} ›</Text>
      </TouchableOpacity> : null}
    </View>
  );

  const startProject = () => {
    setProjectName('Untitled Project');
    setGroup('Edit');
    setTool('Select');
    go('editor');
  };

  const saveProject = () => {
    setProjects(v=>[...v,{name:projectName,date:new Date().toLocaleDateString()}]);
    setMessage('Project saved in this session');
  };

  const toolList = TOOL_GROUPS[group].filter(x=>x.toLowerCase().includes(search.toLowerCase()));

  const ToolButton = ({name}) => (
    <TouchableOpacity
      onPress={()=>chooseTool(name)}
      style={[s.toolButton,{backgroundColor:tool===name?C.glass2:C.glass,borderColor:tool===name?C.blue:C.line}]}>
      <Text style={{fontSize:19,color:C.blue}}>◇</Text>
      <Text numberOfLines={2} style={[s.toolText,{color:C.text}]}>{name}</Text>
    </TouchableOpacity>
  );

  const Timeline = () => (
    <Glass style={s.timeline}>
      <View style={s.timelineHeader}>
        <View>
          <Text style={[s.eyebrow,{color:C.blue}]}>MULTI TRACK SEQUENCE</Text>
          <Text style={[s.sectionTitle,{color:C.text}]}>Timeline</Text>
        </View>
        <TouchableOpacity onPress={()=>setTracks(v=>Math.min(v+1,20))}>
          <Text style={{color:C.blue,fontWeight:'900'}}>＋ TRACK</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={{minWidth:650}}>
          <View style={s.ruler}>
            {['00:00','00:03','00:06','00:09','00:12','00:15','00:18','00:21'].map(x=>
              <Text key={x} style={{color:C.muted,fontSize:9}}>{x}</Text>
            )}
          </View>
          <ScrollView style={{maxHeight:landscape?180:145}} nestedScrollEnabled>
            {Array.from({length:tracks},(_,i)=>i).map(i=>(
              <View key={i} style={s.trackRow}>
                <Text style={[s.trackName,{color:C.text}]}>
                  {['VIDEO 01','AUDIO','OVERLAY','EFFECTS','TEXT','VIDEO 02','VOICEOVER','MUSIC','CAPTIONS','GRAPHICS','MASK','ADJUSTMENT'][i%12]}
                </Text>
                <View style={s.trackLane}>
                  <TouchableOpacity
                    onPress={()=>setMessage('Track '+(i+1)+' selected')}
                    style={[s.clip,{width:Math.min(125+clips*30,350),backgroundColor:i%2? '#6551A4':'#278EAD'}]}>
                    <Text style={{color:'#FFFFFF',fontSize:8,fontWeight:'900'}}>
                      {i===0?'VIDEO CLIP':'LAYER '+(i+1)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </Glass>
  );

  const Preview = () => (
    <Glass style={s.preview}>
      <View style={s.rowBetween}>
        <Text style={[s.eyebrow,{color:C.blue}]}>PREVIEW MONITOR</Text>
        <Text style={{color:C.muted,fontSize:9}}>{resolution} · {fps}</Text>
      </View>
      <View style={s.previewCanvas}>
        <Text style={{fontSize:42,color:C.blue,fontWeight:'900'}}>EP</Text>
        <Text style={{fontSize:17,color:'#FFFFFF',fontWeight:'900',letterSpacing:3}}>ERROR PIXEL</Text>
        <Text style={{fontSize:9,color:'#C5C9E8',marginTop:5}}>VIDEO PREVIEW AREA</Text>
      </View>
      <View style={[s.rowBetween,{marginTop:10}]}>
        <Button title="UNDO" icon="↶" onPress={()=>setMessage('Undo requested')} small/>
        <Button title={playing?'PAUSE':'PLAY'} icon={playing?'Ⅱ':'▶'} active onPress={()=>setPlaying(v=>!v)} small/>
        <Button title="REDO" icon="↷" onPress={()=>setMessage('Redo requested')} small/>
        <Button title="KEYFRAME" icon="◇" onPress={()=>setMessage('Keyframe added')} small/>
      </View>
    </Glass>
  );

  if(page==='welcome') return (
    <SafeAreaView style={[s.safe,{backgroundColor:C.bg}]}>
      <StatusBar barStyle={dark?'light-content':'dark-content'} backgroundColor={C.bg}/>
      <View style={s.welcome}>
        <View style={[s.glow,{backgroundColor:C.purple,top:'15%',left:'10%'}]}/>
        <View style={[s.glow,{backgroundColor:C.blue,bottom:'17%',right:'8%'}]}/>
        <Glass style={s.welcomeGlass}>
          <View style={[s.logoCircle,{borderColor:C.blue}]}>
            <Text style={[s.logoText,{color:C.blue}]}>EP</Text>
          </View>
          <Text style={[s.brand,{color:C.text}]}>ERROR <Text style={{color:C.blue}}>PIXEL</Text></Text>
          <Text style={[s.welcomeSub,{color:C.purple}]}>PROFESSIONAL CREATIVE STUDIO</Text>
          <Text style={[s.welcomeHeadline,{color:C.text}]}>CREATE WITHOUT LIMITS.</Text>
          <Text style={[s.body,{color:C.muted}]}>Video · Photo · Motion · AI · Creator Studio</Text>
          <Button title="GET STARTED" icon="✦" active onPress={()=>{setWelcomeDone(true);go('home');}}/>
          <TouchableOpacity onPress={()=>setDark(v=>!v)} style={{marginTop:18}}>
            <Text style={{color:C.blue,fontSize:12,fontWeight:'800'}}>SWITCH TO {dark?'WHITE':'DARK'} MODE</Text>
          </TouchableOpacity>
        </Glass>
        <Text style={{color:C.muted,fontSize:9,letterSpacing:2,marginTop:25}}>YOUR VISION. YOUR CREATION.</Text>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={[s.safe,{backgroundColor:C.bg}]}>
      <StatusBar barStyle={dark?'light-content':'dark-content'} backgroundColor={C.bg}/>

      {page==='home' && (
        <ScrollView style={{flex:1}} contentContainerStyle={{paddingBottom:35}}>
          <View style={s.header}>
            <View style={{flex:1}}>
              <Text style={[s.brand,{color:C.text}]}>ERROR <Text style={{color:C.blue}}>PIXEL</Text></Text>
              <Text style={[s.headerSub,{color:C.muted}]}>PRO CREATIVE WORKSPACE</Text>
            </View>
            <TouchableOpacity onPress={()=>setDark(v=>!v)} style={[s.themeButton,{backgroundColor:C.glass,borderColor:C.line}]}>
              <Text style={{fontSize:18}}>{dark?'☀':'☾'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>go('settings')} style={[s.themeButton,{backgroundColor:C.glass,borderColor:C.line}]}>
              <Text style={{fontSize:18,color:C.blue}}>⚙</Text>
            </TouchableOpacity>
          </View>

          <View style={s.welcomeBlock}>
            <Text style={[s.eyebrow,{color:C.blue}]}>WELCOME BACK, CREATOR</Text>
            <Text style={[s.bigHeading,{color:C.text}]}>Make Something</Text>
            <Text style={[s.bigHeading,{color:C.purple}]}>Extraordinary.</Text>
            <Text style={[s.body,{color:C.muted}]}>Your creative world starts here.</Text>
          </View>

          <Section title="FEATURED CREATIVE SHOWCASE" action="EXPLORE" onPress={()=>go('templates')}/>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:16,gap:12}}>
            {[
              ['CINEMATIC EDIT','🎬','COLOR + MOTION'],
              ['VELOCITY PACK','⚡','TRENDING STYLE'],
              ['AI CREATIVE LAB','✦','SMART WORKFLOW']
            ].map((x,i)=>(
              <TouchableOpacity key={x[0]} onPress={()=>go('templates')}
                style={[s.featureCard,{backgroundColor:i===0?'#192C4D':i===1?'#302047':'#163B49',borderColor:C.line}]}>
                <Text style={{fontSize:35}}>{x[1]}</Text>
                <Text style={s.featureTitle}>{x[0]}</Text>
                <Text style={s.featureSub}>{x[2]}</Text>
                <Text style={{color:'#8FE5FF',fontSize:10,marginTop:18}}>EXPLORE ↗</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Section title="START CREATING"/>
          <View style={s.createRow}>
            <TouchableOpacity onPress={startProject} style={[s.createCard,{borderColor:C.blue}]}>
              <Text style={{fontSize:30,color:C.blue}}>▶</Text>
              <Text style={[s.cardTitle,{color:C.text}]}>NEW VIDEO</Text>
              <Text style={[s.cardSub,{color:C.muted}]}>CapCut-style editor</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>go('photo')} style={[s.createCard,{borderColor:C.purple}]}>
              <Text style={{fontSize:30,color:C.purple}}>▧</Text>
              <Text style={[s.cardTitle,{color:C.text}]}>EDIT PHOTO</Text>
              <Text style={[s.cardSub,{color:C.muted}]}>Separate photo studio</Text>
            </TouchableOpacity>
          </View>

          <Section title="QUICK TOOLS" action="OPEN EDITOR" onPress={startProject}/>
          <View style={s.quickGrid}>
            {QUICK.map(([name,icon])=>(
              <TouchableOpacity key={name} onPress={()=>{setTool(name);go('editor');}}
                style={[s.quickCard,{backgroundColor:C.glass,borderColor:C.line}]}>
                <Text style={{fontSize:23,color:C.blue}}>{icon}</Text>
                <Text style={[s.quickName,{color:C.text}]}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Section title="RECENT VIDEO PROJECTS" action="VIEW ALL" onPress={()=>go('projects')}/>
          {projects.length===0 ? (
            <Glass style={s.empty}>
              <Text style={{fontSize:28,color:C.purple}}>▣</Text>
              <Text style={[s.cardTitle,{color:C.text}]}>No saved projects yet</Text>
              <Text style={[s.cardSub,{color:C.muted}]}>Create a video project to see it here.</Text>
            </Glass>
          ):projects.slice(-4).reverse().map((p,i)=>(
            <TouchableOpacity key={i} onPress={startProject} style={[s.projectRow,{backgroundColor:C.glass,borderColor:C.line}]}>
              <Text style={{fontSize:25,color:C.blue}}>🎬</Text>
              <View style={{flex:1}}>
                <Text style={{color:C.text,fontWeight:'800'}}>{p.name}</Text>
                <Text style={{color:C.muted,fontSize:10}}>{p.date}</Text>
              </View>
              <Text style={{color:C.blue}}>OPEN ›</Text>
            </TouchableOpacity>
          ))}

          <Section title="CREATOR ECOSYSTEM"/>
          {[
            ['Templates','▧','Discover and upload templates'],
            ['Effects Library','✦','Browse creator effects'],
            ['Creator Studio','♛','Creator profile and levels'],
            ['Cloud Projects','☁','Cloud storage connection required'],
            ['AI Video Tools','✧','Explore AI tools'],
            ['AI Photo Tools','▣','Explore photo AI tools']
          ].map(([name,icon,desc])=>(
            <TouchableOpacity key={name} onPress={()=>go(name==='Cloud Projects'?'cloud':name==='Effects Library'?'effects':name==='AI Video Tools'?'ai':name==='AI Photo Tools'?'photo':name==='Creator Studio'?'creator':'templates')}
              style={[s.ecoRow,{backgroundColor:C.glass,borderColor:C.line}]}>
              <Text style={{fontSize:24,color:C.blue,width:38}}>{icon}</Text>
              <View style={{flex:1}}>
                <Text style={{color:C.text,fontWeight:'800'}}>{name}</Text>
                <Text style={{color:C.muted,fontSize:10,marginTop:4}}>{desc}</Text>
              </View>
              <Text style={{color:C.purple,fontSize:22}}>›</Text>
            </TouchableOpacity>
          ))}

          <Glass style={s.creatorCard}>
            <Text style={[s.eyebrow,{color:C.blue}]}>YOUR CREATOR PROFILE</Text>
            <Text style={[s.bigHeading,{color:C.text,fontSize:22}]}>♛ LEGENDARY</Text>
            <Text style={[s.body,{color:C.muted}]}>Creator ID: {creatorId}</Text>
            <Text style={{color:C.purple,fontWeight:'900',marginTop:8}}>{creatorPoints.toLocaleString()} CREATOR POINTS</Text>
            <Button title="OPEN CREATOR STUDIO" icon="↗" onPress={()=>go('creator')}/>
          </Glass>
        </ScrollView>
      )}

      {page==='editor' && (
        <View style={{flex:1}}>
          <Header title="VIDEO EDITOR"/>
          <View style={[s.editorTop,{borderColor:C.line}]}>
            <TextInput value={projectName} onChangeText={setProjectName}
              placeholder="Project name" placeholderTextColor={C.muted}
              style={[s.projectInput,{color:C.text,backgroundColor:C.input,borderColor:C.line}]}/>
            <Button title="SAVE" icon="▣" small onPress={saveProject}/>
            <Button title="EXPORT" icon="↑" small onPress={()=>go('export')}/>
          </View>

          {landscape ? (
            <View style={{flex:1}}>
              <View style={s.landscapeTop}>
                <Glass style={s.library}>
                  <Text style={[s.eyebrow,{color:C.blue}]}>TOOL LIBRARY</Text>
                  <TextInput value={search} onChangeText={setSearch}
                    placeholder="Search tools..." placeholderTextColor={C.muted}
                    style={[s.search,{color:C.text,backgroundColor:C.input,borderColor:C.line}]}/>
                  <ScrollView>
                    {Object.keys(TOOL_GROUPS).map(g=>(
                      <TouchableOpacity key={g} onPress={()=>setGroup(g)}
                        style={[s.groupButton,{backgroundColor:group===g?C.glass2:'transparent',borderColor:C.line}]}>
                        <Text style={{color:group===g?C.blue:C.text,fontSize:10,fontWeight:'800'}}>{g}</Text>
                      </TouchableOpacity>
                    ))}
                    <View style={s.libraryTools}>
                      {toolList.map(x=><ToolButton key={x} name={x}/>)}
                    </View>
                  </ScrollView>
                </Glass>
                <View style={{flex:1,gap:7}}>
                  <Preview/>
                  <Glass style={{flex:1,padding:10}}>
                    <Text style={[s.eyebrow,{color:C.blue}]}>SELECTED TOOL</Text>
                    <Text style={[s.bigHeading,{color:C.text,fontSize:21}]}>{tool}</Text>
                    <Text style={[s.body,{color:C.muted}]}>{message}</Text>
                    <View style={s.optionGrid}>
                      {['Apply','Adjust','Reset','Add Keyframe','Open Settings'].map(x=>
                        <Button key={x} title={x} small onPress={()=>setMessage(x+' · '+tool)}/>
                      )}
                    </View>
                  </Glass>
                </View>
                <Glass style={s.inspector}>
                  <Text style={[s.eyebrow,{color:C.blue}]}>INSPECTOR</Text>
                  <Text style={[s.sectionTitle,{color:C.text,marginTop:12}]}>Project Settings</Text>
                  <Text style={[s.body,{color:C.muted,marginTop:12}]}>Resolution</Text>
                  {['720p','1080p','2K','4K','8K'].map(x=><Button key={x} title={x} active={resolution===x} small onPress={()=>setResolution(x)}/>)}
                  <Text style={[s.body,{color:C.muted,marginTop:12}]}>Frame Rate</Text>
                  {['30 FPS','60 FPS','120 FPS','240 FPS'].map(x=><Button key={x} title={x} active={fps===x} small onPress={()=>setFps(x)}/>)}
                </Glass>
              </View>
              <Timeline/>
            </View>
          ) : (
            <ScrollView style={{flex:1}} keyboardShouldPersistTaps="handled">
              <Preview/>
              <Timeline/>
              <Glass style={{margin:9,padding:10}}>
                <Text style={[s.eyebrow,{color:C.blue}]}>TOOL SEARCH</Text>
                <TextInput value={search} onChangeText={setSearch}
                  placeholder="Search all editing tools..." placeholderTextColor={C.muted}
                  style={[s.search,{color:C.text,backgroundColor:C.input,borderColor:C.line}]}/>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {Object.keys(TOOL_GROUPS).map(g=><Button key={g} title={g} active={group===g} small onPress={()=>setGroup(g)}/>)}
                </ScrollView>
                <View style={s.libraryTools}>
                  {toolList.map(x=><ToolButton key={x} name={x}/>)}
                </View>
              </Glass>
              <Glass style={{margin:9,padding:10}}>
                <Text style={[s.eyebrow,{color:C.blue}]}>IMPORT MEDIA</Text>
                <TextInput value={mediaSearch} onChangeText={setMediaSearch}
                  placeholder="Search imported media..." placeholderTextColor={C.muted}
                  style={[s.search,{color:C.text,backgroundColor:C.input,borderColor:C.line}]}/>
                <Button title="＋ IMPORT VIDEO / PHOTO" onPress={()=>setMessage('Native media picker connection required')}/>
              </Glass>
              <Text style={{color:C.muted,textAlign:'center',fontSize:9,margin:10}}>{message}</Text>
            </ScrollView>
          )}
        </View>
      )}

      {page==='photo' && (
        <View style={{flex:1}}>
          <Header title="PHOTO STUDIO"/>
          <ScrollView contentContainerStyle={{padding:14}}>
            <Glass style={s.photoCanvas}>
              <Text style={{fontSize:48,color:C.purple}}>▧</Text>
              <Text style={[s.bigHeading,{color:C.text,fontSize:23}]}>PHOTO EDITOR</Text>
              <Text style={[s.body,{color:C.muted}]}>Independent photo workspace</Text>
              <Button title="＋ IMPORT PHOTO" onPress={()=>setMessage('Photo picker connection required')}/>
            </Glass>
            <Section title="PHOTO TOOLS"/>
            <View style={s.quickGrid}>
              {TOOL_GROUPS.Edit.concat(TOOL_GROUPS.Color,TOOL_GROUPS.AI).map(x=>(
                <TouchableOpacity key={x} onPress={()=>setMessage(x+' selected')}
                  style={[s.quickCard,{backgroundColor:C.glass,borderColor:C.line}]}>
                  <Text style={{color:C.blue,fontSize:18}}>◇</Text>
                  <Text style={[s.quickName,{color:C.text}]}>{x}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button title="SAVE PHOTO PROJECT" onPress={()=>{setPhotoProjects(v=>[...v,'Photo Project '+(v.length+1)]);setMessage('Photo project saved in session');}}/>
            <Text style={{color:C.muted,marginTop:15}}>Photo projects: {photoProjects.length}</Text>
          </ScrollView>
        </View>
      )}

      {page==='projects' && (
        <View style={{flex:1}}>
          <Header title="MY PROJECTS"/>
          <ScrollView contentContainerStyle={{padding:15}}>
            <Section title="VIDEO PROJECTS"/>
            {projects.length===0?<Text style={{color:C.muted}}>No video projects saved yet.</Text>:projects.map((p,i)=>
              <TouchableOpacity key={i} onPress={startProject} style={[s.projectRow,{backgroundColor:C.glass,borderColor:C.line}]}>
                <Text style={{color:C.blue,fontSize:23}}>🎬</Text>
                <Text style={{color:C.text,flex:1}}>{p.name}</Text>
                <Text style={{color:C.blue}}>OPEN</Text>
              </TouchableOpacity>
            )}
            <Section title="PHOTO PROJECTS"/>
            {photoProjects.map((p,i)=><Text key={i} style={{color:C.text,padding:12}}>{p}</Text>)}
            <Button title="＋ NEW VIDEO PROJECT" onPress={startProject}/>
          </ScrollView>
        </View>
      )}

      {['templates','effects','ai','creator','cloud','settings','export'].includes(page) && (
        <View style={{flex:1}}>
          <Header title={{
            templates:'TEMPLATES',effects:'EFFECTS LIBRARY',ai:'AI TOOL CENTER',
            creator:'CREATOR STUDIO',cloud:'CLOUD PROJECTS',
            settings:'SETTINGS',export:'EXPORT SETTINGS'
          }[page]}/>
          <ScrollView contentContainerStyle={{padding:15}}>
            {page==='settings' && <>
              <Glass style={s.settingCard}>
                <Text style={[s.sectionTitle,{color:C.text}]}>APPEARANCE</Text>
                <Text style={[s.body,{color:C.muted}]}>Choose your preferred interface theme.</Text>
                <View style={s.createRow}>
                  <Button title="DARK MODE" active={dark} onPress={()=>setDark(true)}/>
                  <Button title="WHITE MODE" active={!dark} onPress={()=>setDark(false)}/>
                </View>
              </Glass>
              <Glass style={s.settingCard}>
                <Text style={[s.sectionTitle,{color:C.text}]}>ABOUT ERROR PIXEL</Text>
                <Text style={[s.body,{color:C.muted}]}>Liquid Glass Creative Studio · Purple + Sky Blue</Text>
              </Glass>
            </>}
            {page==='export' && <>
              <Glass style={s.settingCard}>
                <Text style={[s.sectionTitle,{color:C.text}]}>RESOLUTION</Text>
                <View style={s.optionGrid}>
                  {['720p','1080p','2K','4K','8K'].map(x=><Button key={x} title={x} active={resolution===x} onPress={()=>setResolution(x)} small/>)}
                </View>
                <Text style={[s.sectionTitle,{color:C.text,marginTop:18}]}>FRAME RATE</Text>
                <View style={s.optionGrid}>
                  {['24 FPS','30 FPS','60 FPS','90 FPS','120 FPS','240 FPS'].map(x=><Button key={x} title={x} active={fps===x} onPress={()=>setFps(x)} small/>)}
                </View>
                <Button title="CONFIRM EXPORT SETTINGS" onPress={()=>setMessage('Export settings selected. Rendering engine required.')}/>
              </Glass>
            </>}
            {page==='templates' && <>
              <Text style={[s.bigHeading,{color:C.text,fontSize:24}]}>Creator Templates</Text>
              <Text style={[s.body,{color:C.muted}]}>Discover and manage creative templates.</Text>
              <Button title="＋ UPLOAD TEMPLATE" onPress={()=>setMessage('Template upload requires account and storage backend')}/>
              {['Cinematic Pack','Velocity Transitions','Neon Intro','Cricket Edit Pack'].map(x=><Glass key={x} style={s.listCard}><Text style={{color:C.text,fontWeight:'800'}}>{x}</Text><Button title="PREVIEW" small onPress={()=>setMessage(x+' preview selected')}/></Glass>)}
            </>}
            {page==='effects' && <>
              <Text style={[s.bigHeading,{color:C.text,fontSize:24}]}>Community Effects</Text>
              <Button title="＋ CREATE EFFECT" onPress={()=>setMessage('Effect publishing requires creator backend')}/>
              {['Neon Glow','Motion Blur','RGB Split','Cinematic Shake','Crystal Light'].map(x=><Glass key={x} style={s.listCard}><Text style={{color:C.text,fontWeight:'800'}}>{x}</Text><Button title="USE EFFECT" small onPress={()=>{setTool(x);go('editor');}}/></Glass>)}
            </>}
            {page==='ai' && QUICK.map(([name,icon])=><Glass key={name} style={s.listCard}><Text style={{color:C.text,fontWeight:'800'}}>{icon}  {name}</Text><Button title="OPEN TOOL" small onPress={()=>{setTool(name);go('editor');}}/></Glass>)}
            {page==='creator' && <>
              <Glass style={s.creatorCard}>
                <Text style={[s.eyebrow,{color:C.blue}]}>CREATOR PROFILE</Text>
                <Text style={[s.bigHeading,{color:C.purple,fontSize:25}]}>♛ LEGENDARY</Text>
                <Text style={{color:C.text,marginTop:8}}>Creator ID: {creatorId}</Text>
                <Text style={{color:C.blue,marginTop:8}}>100,000 Creator Points</Text>
              </Glass>
              <Section title="CREATOR LEVELS"/>
              {LEVELS.map((x,i)=><Glass key={x[0]} style={s.listCard}><Text style={{color:C.text,fontWeight:'900'}}>LEVEL {i+1} · {x[0]}</Text><Text style={{color:C.muted,fontSize:11}}>{x[1].toLocaleString()} Points · Reward: {x[2]}</Text></Glass>)}
              <Button title="APPLY AS TEMPLATE CREATOR" onPress={()=>setMessage('Creator application requires verified social account review')}/>
            </>}
            {page==='cloud' && <Glass style={s.settingCard}><Text style={[s.bigHeading,{color:C.text,fontSize:23}]}>Cloud Projects</Text><Text style={[s.body,{color:C.muted}]}>Online cloud sync will activate after backend connection.</Text><Button title="CHECK CLOUD CONNECTION" onPress={()=>setMessage('Cloud backend not connected yet')}/></Glass>}
          </ScrollView>
        </View>
      )}

      <View style={[s.bottomNav,{backgroundColor:C.panel,borderColor:C.line}]}>
        {[
          ['Home','⌂','home'],['Projects','▣','projects'],
          ['Create','＋','editor'],['Templates','▧','templates'],
          ['Profile','♙','creator']
        ].map(([name,icon,target])=>(
          <TouchableOpacity key={name} onPress={()=>target==='editor'?startProject():go(target)} style={s.navItem}>
            <Text style={{fontSize:20,color:page===target?C.blue:C.muted}}>{icon}</Text>
            <Text style={{fontSize:9,color:page===target?C.blue:C.muted,fontWeight:'800'}}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:{flex:1},
  glass:{
    borderWidth:1,borderRadius:20,padding:13,
    shadowColor:'#7C9CFF',shadowOpacity:0.16,
    shadowRadius:16,elevation:7,overflow:'hidden'
  },
  header:{
    minHeight:65,paddingHorizontal:14,flexDirection:'row',
    alignItems:'center',borderBottomWidth:1,gap:10
  },
  headerTitle:{fontSize:16,fontWeight:'900',letterSpacing:1},
  headerSub:{fontSize:8,letterSpacing:1.5,marginTop:3},
  backButton:{width:34,alignItems:'center'},
  themeButton:{
    width:42,height:42,borderRadius:15,borderWidth:1,
    alignItems:'center',justifyContent:'center',marginLeft:5
  },
  brand:{fontSize:25,fontWeight:'900',letterSpacing:2},
  welcome:{
    flex:1,alignItems:'center',justifyContent:'center',
    padding:22,overflow:'hidden'
  },
  glow:{
    position:'absolute',width:230,height:230,borderRadius:150,
    opacity:0.13
  },
  welcomeGlass:{
    width:'100%',maxWidth:480,alignItems:'center',
    paddingVertical:40,paddingHorizontal:20,borderRadius:32
  },
  logoCircle:{
    width:100,height:100,borderRadius:35,borderWidth:2,
    backgroundColor:'rgba(100,170,255,0.12)',
    alignItems:'center',justifyContent:'center',marginBottom:23
  },
  logoText:{fontSize:39,fontWeight:'900',letterSpacing:2},
  welcomeSub:{fontSize:9,fontWeight:'900',letterSpacing:2,marginTop:8},
  welcomeHeadline:{fontSize:20,fontWeight:'900',marginTop:35,textAlign:'center'},
  body:{fontSize:11,lineHeight:18,marginTop:8},
  button:{
    minHeight:39,borderRadius:14,borderWidth:1,
    paddingHorizontal:13,paddingVertical:9,
    flexDirection:'row',alignItems:'center',
    justifyContent:'center',gap:7,marginTop:9
  },
  smallButton:{minHeight:32,paddingHorizontal:9,paddingVertical:6},
  buttonText:{fontSize:10,fontWeight:'900',letterSpacing:0.5},
  buttonIcon:{fontSize:15,fontWeight:'900'},
  welcomeBlock:{paddingHorizontal:19,paddingTop:25,paddingBottom:17},
  eyebrow:{fontSize:9,fontWeight:'900',letterSpacing:1.5},
  bigHeading:{fontSize:29,fontWeight:'900',marginTop:7},
  sectionHead:{
    marginHorizontal:16,marginTop:21,marginBottom:11,
    flexDirection:'row',alignItems:'center',justifyContent:'space-between'
  },
  sectionTitle:{fontSize:13,fontWeight:'900',letterSpacing:0.8},
  featureCard:{
    width:245,height:155,borderRadius:22,borderWidth:1,
    padding:17,justifyContent:'center'
  },
  featureTitle:{fontSize:14,color:'#FFFFFF',fontWeight:'900',marginTop:12},
  featureSub:{fontSize:9,color:'#D5D9F1',marginTop:5},
  createRow:{flexDirection:'row',gap:10,marginHorizontal:15},
  createCard:{
    flex:1,minHeight:130,borderRadius:20,borderWidth:1,
    backgroundColor:'rgba(255,255,255,0.06)',padding:14,justifyContent:'center'
  },
  cardTitle:{fontSize:13,fontWeight:'900',marginTop:10},
  cardSub:{fontSize:9,marginTop:5},
  quickGrid:{flexDirection:'row',flexWrap:'wrap',gap:9,marginHorizontal:15},
  quickCard:{
    width:'47.5%',minHeight:76,borderWidth:1,borderRadius:17,
    padding:12,justifyContent:'center'
  },
  quickName:{fontSize:10,fontWeight:'800',marginTop:6},
  empty:{marginHorizontal:15,alignItems:'center',padding:22},
  projectRow:{
    marginHorizontal:15,marginBottom:9,padding:13,
    borderRadius:15,borderWidth:1,flexDirection:'row',
    alignItems:'center',gap:12
  },
  ecoRow:{
    marginHorizontal:15,marginBottom:8,padding:13,
    borderRadius:16,borderWidth:1,flexDirection:'row',
    alignItems:'center',gap:12
  },
  creatorCard:{margin:15,marginTop:22,gap:6},
  editorTop:{
    flexDirection:'row',alignItems:'center',gap:6,
    padding:8,borderBottomWidth:1
  },
  projectInput:{
    flex:1,minWidth:80,borderWidth:1,borderRadius:10,
    paddingHorizontal:10,paddingVertical:8,fontSize:10
  },
  landscapeTop:{flex:1,flexDirection:'row',padding:7,gap:7,minHeight:0},
  library:{width:landscape?190:145,padding:9},
  inspector:{width:landscape?175:140,padding:9},
  search:{borderWidth:1,borderRadius:10,padding:9,fontSize:10,marginVertical:8},
  groupButton:{borderWidth:1,borderRadius:9,padding:7,marginBottom:5},
  libraryTools:{flexDirection:'row',flexWrap:'wrap',gap:6,marginTop:8},
  toolButton:{
    width:82,minHeight:61,borderWidth:1,borderRadius:12,
    alignItems:'center',justifyContent:'center',padding:5
  },
  toolText:{fontSize:8,fontWeight:'800',textAlign:'center',marginTop:3},
  preview:{padding:10,margin:8},
  rowBetween:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  previewCanvas:{
    height:landscape?100:160,marginTop:9,borderRadius:14,
    backgroundColor:'#11172A',alignItems:'center',justifyContent:'center',
    borderWidth:1,borderColor:'rgba(120,210,255,0.3)'
  },
  timeline:{margin:8,padding:10},
  timelineHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8},
  ruler:{height:27,flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingLeft:90},
  trackRow:{
    height:29,flexDirection:'row',alignItems:'center',
    marginBottom:3,backgroundColor:'rgba(130,150,200,0.08)',
    borderRadius:7,overflow:'hidden'
  },
  trackName:{width:88,fontSize:8,fontWeight:'900',paddingHorizontal:7},
  trackLane:{flex:1,paddingHorizontal:5},
  clip:{height:21,borderRadius:6,justifyContent:'center',paddingHorizontal:7},
  optionGrid:{flexDirection:'row',flexWrap:'wrap',gap:6,marginTop:10},
  settingCard:{marginBottom:12,gap:8},
  listCard:{marginBottom:10,gap:7},
  photoCanvas:{minHeight:230,alignItems:'center',justifyContent:'center',gap:10},
  navItem:{flex:1,alignItems:'center',justifyContent:'center',gap:3},
  bottomNav:{
    height:61,borderTopWidth:1,flexDirection:'row',
    alignItems:'center',justifyContent:'space-around'
  }
});
