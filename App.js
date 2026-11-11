import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  SafeAreaView, StatusBar, StyleSheet, BackHandler,
  Alert
} from 'react-native';

const C = {
  bg: '#080812',
  card: '#171527',
  violet: '#A98BFF',
  cyan: '#80E8F3',
  white: '#FFFFFF',
  muted: '#9290A5',
  border: '#37304D'
};

const tools = {
  BASIC: ['Trim', 'Split', 'Crop', 'Rotate', 'Speed', 'Delete', 'Duplicate'],
  EFFECTS: ['Glow', 'Blur', 'Shake', 'Glitch', 'RGB', 'Particles'],
  AUDIO: ['Music', 'Sound Effects', 'Voice', 'Volume', 'Fade'],
  AI: ['AI Enhance', 'AI FPS Booster', 'AI Upscale', 'AI Stabilize', 'Noise Reduction'],
  ANIMATION: ['Keyframes', 'Motion Blur', 'Velocity', 'Transitions'],
  COLOR: ['Brightness', 'Contrast', 'Saturation', 'Color Grading', 'Filters'],
  TEXT: ['Add Text', 'Captions', 'Fonts', 'Text Animation'],
  EXPORT: ['720p', '1080p', '2K', '4K', '8K']
};

export default function App() {
  const [page, setPage] = useState('home');
  const [drawer, setDrawer] = useState(false);
  const [tab, setTab] = useState('BASIC');
  const [selectedTool, setSelectedTool] = useState('');
  const [project, setProject] = useState('Untitled Project');
  const [playing, setPlaying] = useState(false);
  const [clips, setClips] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState('Video');
  const [showTools, setShowTools] = useState(true);

  const back = () => {
    if (drawer) {
      setDrawer(false);
      return true;
    }
    if (page === 'editor' && showTools) {
      setShowTools(false);
      return true;
    }
    if (page !== 'home') {
      setPage('home');
      return true;
    }
    return false;
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', back);
    return () => sub.remove();
  }, [page, drawer, showTools]);

  const Button = ({ title, onPress, active }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[s.button, active && s.activeButton]}
    >
      <Text style={[s.buttonText, active && { color: C.white }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const Header = ({ title }) => (
    <View style={s.header}>
      <TouchableOpacity onPress={back}>
        <Text style={s.back}>‹</Text>
      </TouchableOpacity>
      <Text style={s.headerTitle}>{title}</Text>
      <TouchableOpacity onPress={() => setDrawer(true)}>
        <Text style={s.menu}>☰</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      {page === 'home' && (
        <ScrollView contentContainerStyle={s.content}>
          <View style={s.header}>
            <View>
              <Text style={s.brand}>ERROR <Text style={{ color: C.violet }}>PIXEL</Text></Text>
              <Text style={s.subtitle}>DIAMOND AI CREATIVE STUDIO</Text>
            </View>
            <TouchableOpacity onPress={() => setDrawer(true)}>
              <Text style={s.menu}>☰</Text>
            </TouchableOpacity>
          </View>

          <View style={s.hero}>
            <Text style={s.heroSmall}>THE NEXT GENERATION OF</Text>
            <Text style={s.heroTitle}>CREATIVE EDITING</Text>
            <Text style={s.heroDescription}>
              Your vision. Your creativity. One powerful studio.
            </Text>
            <Text style={s.logo}>EP</Text>
            <TouchableOpacity
              style={s.primary}
              onPress={() => setPage('editor')}
            >
              <Text style={s.primaryText}>＋  NEW PROJECT</Text>
            </TouchableOpacity>
          </View>

          <View style={s.stats}>
            <View style={s.stat}>
              <Text style={s.statValue}>120</Text>
              <Text style={s.muted}>CREDITS</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statValue}>FREE</Text>
              <Text style={s.muted}>MEMBERSHIP</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statValue}>STUDIO</Text>
              <Text style={s.muted}>WORKSPACE</Text>
            </View>
          </View>

          <Text style={s.heading}>Explore Studio</Text>
          <Button title="▣  VIDEO EDITOR" onPress={() => setPage('editor')} />
          <Button title="◇  PHOTO STUDIO" onPress={() => setPage('photo')} />
          <Button title="✦  AI VIDEO LAB" onPress={() => { setPage('editor'); setTab('AI'); }} />
          <Button title="♫  AUDIO STUDIO" onPress={() => { setPage('editor'); setTab('AUDIO'); }} />

          <Text style={s.heading}>Your Workspace</Text>
          <Button title="My Projects" onPress={() => setPage('projects')} />
          <Button title="Membership" onPress={() => setPage('membership')} />
          <Button title="Settings" onPress={() => setPage('settings')} />

          <Text style={s.footer}>ERROR EDITX • POWERED BY MUNEEB HASSAN</Text>
        </ScrollView>
      )}

      {page === 'editor' && (
        <View style={s.main}>
          <Header title="EDIT STUDIO" />
          <ScrollView contentContainerStyle={s.content}>
            <View style={s.projectBar}>
              <TextInput
                value={project}
                onChangeText={setProject}
                style={s.projectInput}
                placeholder="Project name"
                placeholderTextColor={C.muted}
              />
              <Button title="SAVE" onPress={() => Alert.alert('Project', 'Project name saved in this session.')} />
            </View>

            <View style={s.preview}>
              <Text style={s.muted}>VIDEO PREVIEW</Text>
              <Text style={s.logo}>EP</Text>
              <Text style={s.brand}>ERROR PIXEL</Text>
              <Text style={s.muted}>IMPORT MEDIA TO BEGIN EDITING</Text>
              <TouchableOpacity
                style={s.play}
                onPress={() => setPlaying(!playing)}
              >
                <Text style={s.playText}>{playing ? 'Ⅱ' : '▶'}</Text>
              </TouchableOpacity>
              <Text style={s.muted}>00:00:00 / 00:00:00</Text>
            </View>

            <View style={s.row}>
              <Button title="＋ IMPORT" onPress={() => Alert.alert('Import', 'Media picker integration is not connected yet.')} />
              <Button title="↶ UNDO" onPress={() => setSelectedTool('Undo')} />
              <Button title="↷ REDO" onPress={() => setSelectedTool('Redo')} />
              <Button title="EXPORT" onPress={() => setPage('export')} />
            </View>

            <Text style={s.heading}>MULTI-TRACK TIMELINE</Text>
            <View style={s.timeline}>
              <Text style={s.muted}>00:00 ───── 00:05 ───── 00:10 ───── 00:15</Text>
              {['Video', 'Audio', 'Overlay', 'Effects', 'Text'].map((track, i) => (
                <TouchableOpacity
                  key={track}
                  onPress={() => setSelectedTrack(track)}
                  style={[s.track, selectedTrack === track && s.selectedTrack]}
                >
                  <Text style={s.trackName}>{track}</Text>
                  <View style={[s.clip, { backgroundColor: ['#7658B8', '#347F91', '#8E588E', '#9C774A', '#416D9D'][i] }]}>
                    <Text style={s.clipText}>
                      {i === 0 ? `Video Clip ${clips}` : track}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={s.row}>
              <Button title="＋ ADD CLIP" onPress={() => setClips(v => v + 1)} />
              <Button title="DUPLICATE" onPress={() => setClips(v => v + 1)} />
              <Button title="DELETE" onPress={() => setClips(v => Math.max(0, v - 1))} />
            </View>

            <View style={s.toolHeader}>
              <Text style={s.heading}>EDITING TOOLS</Text>
              <TouchableOpacity onPress={() => setShowTools(!showTools)}>
                <Text style={s.link}>{showTools ? 'HIDE' : 'SHOW'}</Text>
              </TouchableOpacity>
            </View>

            {showTools && (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {Object.keys(tools).map(name => (
                    <Button
                      key={name}
                      title={name}
                      active={tab === name}
                      onPress={() => {
                        setTab(name);
                        setSelectedTool('');
                      }}
                    />
                  ))}
                </ScrollView>

                <View style={s.toolGrid}>
                  {tools[tab].map(name => (
                    <TouchableOpacity
                      key={name}
                      onPress={() => setSelectedTool(name)}
                      style={[s.tool, selectedTool === name && s.activeButton]}
                    >
                      <Text style={s.toolText}>{name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={s.selectedBox}>
                  <Text style={s.brand}>{selectedTool || 'Select a tool'}</Text>
                  <Text style={s.muted}>Selected track: {selectedTrack}</Text>
                  <Button
                    title="APPLY"
                    onPress={() => Alert.alert('Tool', `${selectedTool || 'No tool'} selected. Processing engine needs integration.`)}
                  />
                </View>
              </>
            )}

            <Text style={s.footer}>
              INTERFACE PREVIEW • VIDEO PROCESSING ENGINE NOT YET CONNECTED
            </Text>
          </ScrollView>
        </View>
      )}

      {page === 'photo' && (
        <View style={s.main}>
          <Header title="PHOTO STUDIO" />
          <ScrollView contentContainerStyle={s.content}>
            <View style={s.preview}>
              <Text style={s.logo}>EP</Text>
              <Text style={s.brand}>PHOTO CANVAS</Text>
              <Text style={s.muted}>YOUR DESIGN WORKSPACE</Text>
            </View>
            {['Import Image', 'Crop', 'Filters', 'Color Grading', 'Background Remove', 'AI Upscale', '3D Text'].map(x => (
              <Button key={x} title={x} onPress={() => Alert.alert(x, 'This tool needs integration.')} />
            ))}
          </ScrollView>
        </View>
      )}

      {page === 'projects' && (
        <View style={s.main}>
          <Header title="MY PROJECTS" />
          <View style={s.content}>
            <Text style={s.heading}>RECENT PROJECTS</Text>
            <Text style={s.muted}>Your saved projects will appear here.</Text>
          </View>
        </View>
      )}

      {page === 'membership' && (
        <View style={s.main}>
          <Header title="MEMBERSHIP" />
          <ScrollView contentContainerStyle={s.content}>
            {[
              ['WEEKLY', 'Rs. 350'],
              ['MONTHLY', 'Rs. 1,200'],
              ['YEARLY', 'Rs. 9,000'],
              ['LIFETIME', 'Rs. 30,000']
            ].map(plan => (
              <View key={plan[0]} style={s.plan}>
                <Text style={s.heading}>{plan[0]}</Text>
                <Text style={s.statValue}>{plan[1]}</Text>
                <Text style={s.muted}>Premium features</Text>
                <Button title="CHOOSE PLAN" onPress={() => Alert.alert('Membership', 'Payment gateway is not connected yet.')} />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {page === 'settings' && (
        <View style={s.main}>
          <Header title="SETTINGS" />
          <View style={s.content}>
            {['Language', 'Appearance', 'Editor Preferences', 'Auto Save', 'Notifications', 'Storage', 'Support'].map(x => (
              <View key={x} style={s.setting}>
                <Text style={s.buttonText}>{x}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {page === 'export' && (
        <View style={s.main}>
          <Header title="EXPORT SETTINGS" />
          <ScrollView contentContainerStyle={s.content}>
            <Text style={s.heading}>RESOLUTION</Text>
            {['720p', '1080p', '2K', '4K', '8K'].map(x => (
              <Button key={x} title={x} onPress={() => setSelectedTool(x)} active={selectedTool === x} />
            ))}
            <Text style={s.heading}>FRAME RATE</Text>
            {['24 FPS', '30 FPS', '60 FPS', '90 FPS', '120 FPS'].map(x => (
              <Button key={x} title={x} onPress={() => setSelectedTool(x)} active={selectedTool === x} />
            ))}
            <Button title="START EXPORT" onPress={() => Alert.alert('Export', 'Export engine is not connected yet.')} />
          </ScrollView>
        </View>
      )}

      {drawer && (
        <View style={s.drawerOverlay}>
          <TouchableOpacity style={s.dismiss} onPress={() => setDrawer(false)} />
          <View style={s.drawer}>
            <Text style={s.brand}>ERROR PIXEL</Text>
            <Text style={s.muted}>CREATIVE STUDIO</Text>
            {[
              ['Dashboard', 'home'],
              ['Video Editor', 'editor'],
              ['Photo Studio', 'photo'],
              ['My Projects', 'projects'],
              ['Membership', 'membership'],
              ['Settings', 'settings']
            ].map(item => (
              <TouchableOpacity
                key={item[1]}
                style={s.drawerItem}
                onPress={() => {
                  setDrawer(false);
                  setPage(item[1]);
                }}
              >
                <Text style={s.buttonText}>{item[0]}</Text>
                <Text style={s.link}>↗</Text>
              </TouchableOpacity>
            ))}
            <Text style={s.footer}>ERROR EDITX</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  main: { flex: 1, backgroundColor: C.bg },
  content: { padding: 18, paddingBottom: 50 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  brand: {
    color: C.white,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2
  },
  subtitle: {
    color: C.cyan,
    fontSize: 8,
    letterSpacing: 2,
    marginTop: 5
  },
  menu: { color: C.violet, fontSize: 25 },
  hero: {
    backgroundColor: C.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.border,
    padding: 22,
    alignItems: 'center'
  },
  heroSmall: { color: C.cyan, fontSize: 9, letterSpacing: 2 },
  heroTitle: {
    color: C.white,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 10,
    textAlign: 'center'
  },
  heroDescription: {
    color: C.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 12
  },
  logo: {
    color: C.violet,
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -5,
    marginVertical: 22,
    textShadowColor: C.violet,
    textShadowRadius: 18
  },
  primary: {
    backgroundColor: '#493875',
    borderWidth: 1,
    borderColor: C.violet,
    borderRadius: 13,
    padding: 17,
    width: '100%',
    alignItems: 'center',
    marginTop: 10
  },
  primaryText: { color: C.white, fontWeight: '900', letterSpacing: 1 },
  stats: { flexDirection: 'row', gap: 8, marginTop: 14 },
  stat: {
    flex: 1,
    backgroundColor: C.card,
    padding: 13,
    borderRadius: 13,
    alignItems: 'center'
  },
  statValue: { color: C.white, fontSize: 16, fontWeight: '900' },
  muted: { color: C.muted, fontSize: 9, marginTop: 6 },
  heading: {
    color: C.white,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 25,
    marginBottom: 12
  },
  button: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 9,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeButton: {
    backgroundColor: '#493875',
    borderColor: C.violet
  },
  buttonText: { color: C.muted, fontSize: 11, fontWeight: '700' },
  footer: {
    color: C.muted,
    fontSize: 8,
    textAlign: 'center',
    marginTop: 35,
    letterSpacing: 1
  },
  headerTitle: {
    color: C.white,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1
  },
  back: { color: C.violet, fontSize: 32 },
  projectBar: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  projectInput: {
    flex: 1,
    backgroundColor: C.card,
    color: C.white,
    borderRadius: 10,
    padding: 12
  },
  preview: {
    backgroundColor: '#11101D',
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    padding: 15
  },
  play: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#493875',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15
  },
  playText: { color: C.white, fontSize: 18 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 },
  timeline: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: C.border
  },
  selectedTrack: { backgroundColor: '#29213D' },
  trackName: { color: C.white, width: 75, fontSize: 10 },
  clip: {
    flex: 1,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  clipText: { color: C.white, fontSize: 9, fontWeight: '700' },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  link: { color: C.cyan, fontSize: 10, fontWeight: '800' },
  toolGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 15 },
  tool: {
    width: '31%',
    minHeight: 55,
    borderRadius: 11,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  toolText: { color: C.white, fontSize: 10, textAlign: 'center' },
  selectedBox: {
    backgroundColor: C.card,
    padding: 14,
    borderRadius: 13,
    marginTop: 18
  },
  plan: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 18,
    borderRadius: 15,
    marginBottom: 13
  },
  setting: {
    padding: 18,
    backgroundColor: C.card,
    borderRadius: 12,
    marginBottom: 9
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  dismiss: { flex: 1 },
  drawer: {
    width: '78%',
    backgroundColor: '#151323',
    padding: 22,
    paddingTop: 55,
    borderLeftWidth: 1,
    borderColor: C.border
  },
  drawerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 19,
    borderBottomWidth: 1,
    borderColor: C.border
  }
});