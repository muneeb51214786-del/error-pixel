
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, SafeAreaView
} from 'react-native';

const C = {
  bg: '#080713',
  panel: '#151329',
  panel2: '#201A3B',
  cyan: '#65E8FF',
  purple: '#A78BFA',
  pink: '#E78BFF',
  white: '#F8F7FF',
  muted: '#9691AE',
  line: '#30294D',
  gold: '#FFD778'
};

const featured = [
  { title: 'Cinematic Color Grading', sub: 'PRO CREATOR PRESET', color: '#263A69', icon: '🎬' },
  { title: 'Velocity Edit Pack', sub: 'TRENDING TEMPLATE', color: '#46265F', icon: '⚡' },
  { title: 'AI Video Enhancement', sub: 'ULTRA HD WORKFLOW', color: '#174B59', icon: '✨' }
];

const projects = [
  { name: 'Untitled Project 01', type: 'VIDEO PROJECT', icon: '🎞️', time: 'Today' },
  { name: 'Cricket Cinematic Edit', type: 'VIDEO PROJECT', icon: '🏏', time: 'Yesterday' },
  { name: 'My Photo Design', type: 'PHOTO PROJECT', icon: '🖼️', time: '2 days ago' }
];

const quickTools = [
  ['AI Video Enhancer', '✨'],
  ['Quality Upscaler', '⬆️'],
  ['FPS Booster', '⚡'],
  ['AI Photo Enhancer', '📸'],
  ['Background Removal', '✂️'],
  ['Color Grading', '🎨'],
  ['Auto Captions', '💬'],
  ['AI Denoiser', '🔊']
];

const sections = [
  ['AI Video Tools', '🎥', 'Enhance, upscale and create'],
  ['AI Photo Tools', '📷', 'Retouch and transform photos'],
  ['Templates', '🧩', 'Discover creator templates'],
  ['Effects Library', '✨', 'Explore community effects'],
  ['Creator Studio', '👑', 'Your creator dashboard'],
  ['Cloud Projects', '☁️', 'Your saved project space']
];

function App() {
  const [tab, setTab] = useState('Home');
  const [slide, setSlide] = useState(0);

  const featuredItem = featured[slide];

  const Header = () => (
    <View style={s.header}>
      <View>
        <Text style={s.brand}>ERROR <Text style={{color:C.cyan}}>PIXEL</Text></Text>
        <Text style={s.tagline}>CREATE WITHOUT LIMITS</Text>
      </View>
      <TouchableOpacity style={s.profile}>
        <Text style={{fontSize:21}}>👑</Text>
      </TouchableOpacity>
    </View>
  );

  const SectionTitle = ({title, action}) => (
    <View style={s.sectionHead}>
      <Text style={s.sectionTitle}>{title}</Text>
      <Text style={s.seeAll}>{action || 'VIEW ALL  ›'}</Text>
    </View>
  );

  const ActionButton = ({title, icon, onPress, primary}) => (
    <TouchableOpacity
      onPress={onPress}
      style={[s.actionButton, primary && s.primaryButton]}
    >
      <Text style={s.actionIcon}>{icon}</Text>
      <Text style={[s.actionText, primary && {color:'#090817'}]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={s.container}>
        <Header />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom:110}}
        >
          <View style={s.welcome}>
            <Text style={s.hello}>WELCOME BACK, CREATOR</Text>
            <Text style={s.heading}>Make Something</Text>
            <Text style={s.headingAccent}>Extraordinary.</Text>
            <Text style={s.description}>
              Your creative world. One powerful workspace.
            </Text>
          </View>

          <SectionTitle title="FEATURED FOR YOU" action="EXPLORE  ›" />
          <View style={[s.featured, {backgroundColor:featuredItem.color}]}>
            <View style={s.featureTop}>
              <Text style={s.featureTag}>{featuredItem.sub}</Text>
              <Text style={s.featureNumber}>0{slide + 1} / 03</Text>
            </View>
            <Text style={s.featureIcon}>{featuredItem.icon}</Text>
            <Text style={s.featureTitle}>{featuredItem.title}</Text>
            <Text style={s.featureSub}>Discover new creative possibilities</Text>
            <View style={s.featureBottom}>
              <TouchableOpacity style={s.exploreButton}>
                <Text style={s.exploreText}>EXPLORE NOW  ↗</Text>
              </TouchableOpacity>
              <View style={s.dots}>
                {featured.map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setSlide(i)}
                    style={[s.dot, slide === i && s.activeDot]}
                  />
                ))}
              </View>
            </View>
          </View>

          <SectionTitle title="START CREATING" />
          <View style={s.createRow}>
            <TouchableOpacity style={s.createCard} onPress={() => setTab('Video Editor')}>
              <Text style={s.createIcon}>🎬</Text>
              <Text style={s.createTitle}>New Video</Text>
              <Text style={s.createSub}>Create a video project</Text>
              <Text style={s.plus}>＋</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.createCard, s.photoCard]} onPress={() => setTab('Photo Studio')}>
              <Text style={s.createIcon}>🖼️</Text>
              <Text style={s.createTitle}>Edit Photo</Text>
              <Text style={s.createSub}>Open photo studio</Text>
              <Text style={s.plus}>＋</Text>
            </TouchableOpacity>
          </View>

          <SectionTitle title="QUICK TOOLS" action="ALL TOOLS  ›" />
          <View style={s.toolGrid}>
            {quickTools.map(([name, icon]) => (
              <TouchableOpacity
                key={name}
                style={s.toolCard}
                onPress={() => setTab(name)}
              >
                <View style={s.toolIconBox}>
                  <Text style={s.toolIcon}>{icon}</Text>
                </View>
                <Text style={s.toolName}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <SectionTitle title="RECENT PROJECTS" action="SEE ALL  ›" />
          {projects.map((p, i) => (
            <TouchableOpacity key={i} style={s.projectRow}>
              <View style={s.projectThumb}>
                <Text style={{fontSize:25}}>{p.icon}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={s.projectName}>{p.name}</Text>
                <Text style={s.projectMeta}>{p.type}  •  {p.time}</Text>
              </View>
              <Text style={s.more}>•••</Text>
            </TouchableOpacity>
          ))}

          <SectionTitle title="CREATOR ECOSYSTEM" />
          {sections.map(([name, icon, desc]) => (
            <TouchableOpacity
              key={name}
              style={s.ecoRow}
              onPress={() => setTab(name)}
            >
              <View style={s.ecoIconBox}>
                <Text style={{fontSize:23}}>{icon}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={s.ecoTitle}>{name}</Text>
                <Text style={s.ecoDesc}>{desc}</Text>
              </View>
              <Text style={s.arrow}>›</Text>
            </TouchableOpacity>
          ))}

          <View style={s.creatorCard}>
            <Text style={s.creatorLabel}>YOUR CREATOR ID</Text>
            <Text style={s.creatorId}>EP-OWNER-0001</Text>
            <View style={s.rankRow}>
              <Text style={s.rank}>👑 LEGENDARY CREATOR</Text>
              <Text style={s.points}>100,000 XP</Text>
            </View>
            <View style={s.progressTrack}>
              <View style={s.progressFill} />
            </View>
            <Text style={s.creatorNote}>Creator profile preview</Text>
          </View>

          <View style={s.footer}>
            <Text style={s.footerBrand}>ERROR PIXEL</Text>
            <Text style={s.footerText}>YOUR VISION. YOUR CREATION.</Text>
            <Text style={s.version}>CREATIVE STUDIO • VERSION 1.0</Text>
          </View>
        </ScrollView>

        <View style={s.bottomNav}>
          {[
            ['Home','⌂'],
            ['Projects','▣'],
            ['Create','＋'],
            ['Templates','▧'],
            ['Profile','◉']
          ].map(([name, icon]) => (
            <TouchableOpacity
              key={name}
              style={s.navItem}
              onPress={() => setTab(name)}
            >
              <Text style={[s.navIcon, tab === name && {color:C.cyan}]}>{icon}</Text>
              <Text style={[s.navText, tab === name && {color:C.cyan}]}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg},
  container:{flex:1,backgroundColor:C.bg},
  header:{
    height:66,paddingHorizontal:19,flexDirection:'row',
    alignItems:'center',justifyContent:'space-between',
    borderBottomWidth:1,borderBottomColor:C.line
  },
  brand:{fontSize:23,fontWeight:'900',color:C.white,letterSpacing:2},
  tagline:{fontSize:8,color:C.muted,letterSpacing:2,marginTop:2},
  profile:{
    width:43,height:43,borderRadius:15,backgroundColor:C.panel2,
    borderWidth:1,borderColor:C.purple,alignItems:'center',justifyContent:'center'
  },
  welcome:{paddingHorizontal:20,paddingTop:25,paddingBottom:20},
  hello:{fontSize:10,color:C.cyan,fontWeight:'800',letterSpacing:2},
  heading:{fontSize:29,color:C.white,fontWeight:'900',marginTop:9},
  headingAccent:{fontSize:29,color:C.purple,fontWeight:'900'},
  description:{fontSize:12,color:C.muted,marginTop:8},
  sectionHead:{
    marginHorizontal:19,marginTop:17,marginBottom:12,
    flexDirection:'row',justifyContent:'space-between',alignItems:'center'
  },
  sectionTitle:{fontSize:12,color:C.white,fontWeight:'900',letterSpacing:1.3},
  seeAll:{fontSize:9,color:C.cyan,fontWeight:'800'},
  featured:{
    marginHorizontal:17,borderRadius:22,padding:19,
    minHeight:190,borderWidth:1,borderColor:'#7770AA'
  },
  featureTop:{flexDirection:'row',justifyContent:'space-between'},
  featureTag:{fontSize:9,color:C.cyan,fontWeight:'900',letterSpacing:1.5},
  featureNumber:{fontSize:10,color:'#FFFFFFAA'},
  featureIcon:{fontSize:31,marginTop:15},
  featureTitle:{fontSize:21,color:C.white,fontWeight:'900',marginTop:7},
  featureSub:{fontSize:11,color:'#E1DDF5',marginTop:5},
  featureBottom:{
    flexDirection:'row',alignItems:'center',
    justifyContent:'space-between',marginTop:17
  },
  exploreButton:{
    backgroundColor:C.cyan,borderRadius:10,
    paddingVertical:10,paddingHorizontal:13
  },
  exploreText:{fontSize:9,color:C.bg,fontWeight:'900'},
  dots:{flexDirection:'row',gap:6},
  dot:{width:7,height:7,borderRadius:5,backgroundColor:'#FFFFFF66'},
  activeDot:{width:19,backgroundColor:C.cyan},
  createRow:{flexDirection:'row',gap:11,marginHorizontal:17},
  createCard:{
    flex:1,minHeight:135,backgroundColor:C.panel,
    borderRadius:18,padding:14,borderWidth:1,borderColor:'#45406A'
  },
  photoCard:{backgroundColor:'#21172F',borderColor:'#6B477C'},
  createIcon:{fontSize:27},
  createTitle:{fontSize:15,color:C.white,fontWeight:'900',marginTop:9},
  createSub:{fontSize:10,color:C.muted,marginTop:4},
  plus:{position:'absolute',right:13,top:12,fontSize:21,color:C.cyan},
  toolGrid:{
    marginHorizontal:16,flexDirection:'row',
    flexWrap:'wrap',justifyContent:'space-between'
  },
  toolCard:{
    width:'23.5%',minHeight:91,backgroundColor:C.panel,
    borderRadius:14,alignItems:'center',justifyContent:'center',
    marginBottom:9,padding:5,borderWidth:1,borderColor:C.line
  },
  toolIconBox:{
    width:39,height:39,borderRadius:13,backgroundColor:C.panel2,
    alignItems:'center',justifyContent:'center',marginBottom:7
  },
  toolIcon:{fontSize:20},
  toolName:{fontSize:9,color:C.white,textAlign:'center',fontWeight:'700'},
  projectRow:{
    marginHorizontal:17,marginBottom:9,padding:10,
    backgroundColor:C.panel,borderRadius:14,
    flexDirection:'row',alignItems:'center',gap:12
  },
  projectThumb:{
    width:48,height:48,borderRadius:12,
    backgroundColor:C.panel2,alignItems:'center',justifyContent:'center'
  },
  projectName:{fontSize:12,color:C.white,fontWeight:'800'},
  projectMeta:{fontSize:9,color:C.muted,marginTop:5},
  more:{color:C.muted,fontSize:18,paddingHorizontal:5},
  ecoRow:{
    marginHorizontal:17,marginBottom:8,padding:11,
    backgroundColor:C.panel,borderRadius:14,
    flexDirection:'row',alignItems:'center',gap:12
  },
  ecoIconBox:{
    width:43,height:43,borderRadius:13,backgroundColor:C.panel2,
    alignItems:'center',justifyContent:'center'
  },
  ecoTitle:{fontSize:12,color:C.white,fontWeight:'800'},
  ecoDesc:{fontSize:9,color:C.muted,marginTop:4},
  arrow:{fontSize:25,color:C.purple,paddingHorizontal:5},
  creatorCard:{
    margin:17,marginTop:18,padding:17,borderRadius:19,
    backgroundColor:'#211B38',borderWidth:1,borderColor:C.gold
  },
  creatorLabel:{fontSize:9,color:C.gold,fontWeight:'900',letterSpacing:2},
  creatorId:{fontSize:22,color:C.white,fontWeight:'900',marginTop:9},
  rankRow:{flexDirection:'row',justifyContent:'space-between',marginTop:12},
  rank:{fontSize:10,color:C.gold,fontWeight:'900'},
  points:{fontSize:10,color:C.cyan,fontWeight:'900'},
  progressTrack:{height:6,backgroundColor:'#403957',borderRadius:5,marginTop:12},
  progressFill:{width:'100%',height:6,backgroundColor:C.gold,borderRadius:5},
  creatorNote:{fontSize:9,color:C.muted,marginTop:9},
  footer:{alignItems:'center',paddingVertical:22},
  footerBrand:{fontSize:17,color:C.white,fontWeight:'900',letterSpacing:3},
  footerText:{fontSize:9,color:C.cyan,letterSpacing:2,marginTop:5},
  version:{fontSize:8,color:C.muted,marginTop:9},
  bottomNav:{
    height:67,backgroundColor:'#100E20',
    borderTopWidth:1,borderTopColor:C.line,
    flexDirection:'row',justifyContent:'space-around',alignItems:'center'
  },
  navItem:{alignItems:'center',justifyContent:'center',minWidth:55},
  navIcon:{fontSize:21,color:C.muted},
  navText:{fontSize:9,color:C.muted,marginTop:3,fontWeight:'700'}
});

export default App;
