import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  SafeAreaView, StatusBar, StyleSheet, BackHandler, Alert
} from 'react-native';

const C = {
  bg: '#080812',
  card: '#171527',
  violet: '#A98BFF',
  cyan: '#80E8F3',
  white: '#FFFFFF',
  muted: '#9290A5',
  border: '#37304D',
  glass: '#211B35'
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
      activeOpacity={0.75}
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

  const DashboardAction = ({ icon, title, subtitle, onPress, wide }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[s.actionCard, wide && s.actionWide]}
    >
      <Text style={s.actionIcon}>{icon}</Text>
      <Text style={s.actionTitle}>{title}</Text>
      <Text style={s.actionSubtitle}>{subtitle}</Text>
      <Text style={s.actionArrow}>↗</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      {/* PREMIUM DASHBOARD */}
      {page === 'home' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.dashboard}
        >
          <View style={s.dashHeader}>
            <View>
              <Text style={s.brand}>
                ERROR <Text style={{ color: C.violet }}>PIXEL</Text>
              </Text>
              <Text style={s.subtitle}>DIAMOND AI CREATIVE STUDIO</Text>
            </View>
            <TouchableOpacity
              style={s.profileButton}
              onPress={() => setDrawer(true)}
            >
              <Text style={s.profileIcon}>☰</Text>
            </TouchableOpacity>
          </View>

          <View style={s.welcomeRow}>
            <View>
              <Text style={s.welcomeSmall}>WELCOME TO YOUR STUDIO</Text>
              <Text style={s.welcomeTitle}>Create something</Text>
              <Text style={s.welcomeTitle}>
                <Text style={{ color: C.violet }}>extraordinary.</Text>
              </Text>
            </View>
            <View style={s.miniLogo}>
              <Text style={s.miniLogoText}>EP</Text>
            </View>
          </View>

          <View style={s.hero}>
            <View style={s.heroTop}>
              <View style={s.liveDot} />
              <Text style={s.heroBadge}>YOUR CREATIVE SPACE</Text>
              <Text style={s.heroVersion}>01</Text>
            </View>

            <Text style={s.heroSmall}>THE NEXT GENERATION OF</Text>
            <Text style={s.heroTitle}>CREATIVE</Text>
            <Text style={s.heroTitleAccent}>EDITING.</Text>
            <Text style={s.heroDescription}>
              Your vision. Your creativity. One powerful studio.
            </Text>

            <View style={s.heroArtwork}>
              <View style={s.orbitOuter} />
              <View style={s.orbitInner} />
              <Text style={s.heroLogo}>EP</Text>
              <Text style={s.heroLogoCaption}>ERROR PIXEL</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={s.primary}
              onPress={() => setPage('editor')}
            >
              <Text style={s.primaryText}>＋  CREATE NEW PROJECT</Text>
              <Text style={s.primaryArrow}>↗</Text>
            </TouchableOpacity>
          </View>

          <View style={s.creditPanel}>
            <View style={s.creditLeft}>
              <Text style={s.creditLabel}>FREE STARTER CREDITS</Text>
              <View style={s.creditNumberRow}>
                <Text style={s.creditNumber}>3</Text>
                <Text style={s.creditUnit}> CREDITS</Text>
              </View>
              <Text style={s.creditNote}>
                Free account allowance
              </Text>
            </View>
            <View style={s.creditIconBox}>
              <Text style={s.creditIcon}>✦</Text>
            </View>
          </View>

          <View style={s.sectionHeading}>
            <View>
              <Text style={s.sectionTitle}>Explore Studio</Text>
              <Text style={s.sectionCaption}>
                YOUR CREATIVE TOOLS, ALL IN ONE PLACE
              </Text>
            </View>
            <Text style={s.sectionNumber}>01 / 04</Text>
          </View>

          <View style={s.actionGrid}>
            <DashboardAction
              icon="▣"
              title="VIDEO EDITOR"
              subtitle="Professional editing"
              wide
              onPress={() => setPage('editor')}
            />
            <DashboardAction
              icon="◇"
              title="PHOTO STUDIO"
              subtitle="Creative image tools"
              onPress={() => setPage('photo')}
            />
            <DashboardAction
              icon="✦"
              title="AI VIDEO LAB"
              subtitle="AI powered tools"
              onPress={() => {
                setPage('editor');
                setTab('AI');
              }}
            />
            <DashboardAction
              icon="♫"
              title="AUDIO STUDIO"
              subtitle="Sound and music"
              onPress={() => {
                setPage('editor');
                setTab('AUDIO');
              }}
            />
          </View>

          <View style={s.sectionHeading}>
            <View>
              <Text style={s.sectionTitle}>Your Workspace</Text>
              <Text style={s.sectionCaption}>
                EVERYTHING YOU NEED TO MANAGE
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={s.workspaceCard}
            onPress={() => setPage('projects')}
          >
            <View style={s.workspaceIcon}>
              <Text style={s.workspaceIconText}>▤</Text>
            </View>
            <View style={s.workspaceInfo}>
              <Text style={s.workspaceTitle}>My Projects</Text>
              <Text style={s.workspaceSubtitle}>
                Your creative workspace
              </Text>
            </View>
            <Text style={s.workspaceArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.workspaceCard}
            onPress={() => setPage('membership')}
          >
            <View style={s.workspaceIcon}>
              <Text style={s.workspaceIconText}>♛</Text>
            </View>
            <View style={s.workspaceInfo}>
              <Text style={s.workspaceTitle}>Premium Membership</Text>
              <Text style={s.workspaceSubtitle}>
                Explore membership plans
              </Text>
            </View>
            <Text style={s.workspaceArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.workspaceCard}
            onPress={() => setPage('settings')}
          >
            <View style={s.workspaceIcon}>
              <Text style={s.workspaceIconText}>⚙</Text>
            </View>
            <View style={s.workspaceInfo}>
              <Text style={s.workspaceTitle}>Settings</Text>
              <Text style={s.workspaceSubtitle}>
                Customize your experience
              </Text>
            </View>
            <Text style={s.workspaceArrow}>›</Text>
          </TouchableOpacity>

          <View style={s.premiumBanner}>
            <Text style={s.premiumEyebrow}>UNLOCK YOUR POTENTIAL</Text>
            <Text style={s.premiumTitle}>Go Premium.</Text>
            <Text style={s.premiumDescription}>
              Discover plans for your creative journey.
            </Text>
            <TouchableOpacity
              style={s.premiumButton}
              onPress={() => setPage('membership')}
            >
              <Text style={s.premiumButtonText}>EXPLORE PLANS  ↗</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.footer}>
            ERROR PIXEL  •  POWERED BY ERROR EDITX
          </Text>
          <Text style={s.footerSmall}>CREATIVITY WITHOUT LIMITS</Text>
        </ScrollView>
      )}

      {/* VIDEO EDITOR */}
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
              <Button
                title="SAVE"
                onPress={() =>
                  Alert.alert('Project', 'Project name saved in this session.')
                }
              />
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
              <Button
                title="＋ IMPORT"
                onPress={() =>
                  Alert.alert('Import', 'Media picker integration is not connected yet.')
                }
              />
              <Button title="↶ UNDO" onPress={() => setSelectedTool('Undo')} />
              <Button title="↷ REDO" onPress={() => setSelectedTool('Redo')} />
              <Button title="EXPORT" onPress={() => setPage('export')} />
            </View>

            <Text style={s.heading}>MULTI-TRACK TIMELINE</Text>
            <View style={s.timeline}>
              <Text style={s.muted}>
                00:00 ───── 00:05 ───── 00:10 ───── 00:15
              </Text>
              {['Video', 'Audio', 'Overlay', 'Effects', 'Text'].map((track, i) => (
                <TouchableOpacity
                  key={track}
                  onPress={() => setSelectedTrack(track)}
                  style={[
                    s.track,
                    selectedTrack === track && s.selectedTrack
                  ]}
                >
                  <Text style={s.trackName}>{track}</Text>
                  <View
                    style={[
                      s.clip,
                      {
                        backgroundColor: [
                          '#7658B8', '#347F91', '#8E588E',
                          '#9C774A', '#416D9D'
                        ][i]
                      }
                    ]}
                  >
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
              <Button
                title="DELETE"
                onPress={() => setClips(v => Math.max(0, v - 1))}
              />
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
                      style={[
                        s.tool,
                        selectedTool === name && s.activeButton
                      ]}
                    >
                      <Text style={s.toolText}>{name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={s.selectedBox}>
                  <Text style={s.brand}>
                    {selectedTool || 'Select a tool'}
                  </Text>
                  <Text style={s.muted}>
                    Selected track: {selectedTrack}
                  </Text>
                  <Button
                    title="APPLY"
                    onPress={() =>
                      Alert.alert(
                        'Tool',
                        `${selectedTool || 'No tool'} selected. Processing engine needs integration.`
                      )
                    }
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

      {/* PHOTO STUDIO */}
      {page === 'photo' && (
        <View style={s.main}>
          <Header title="PHOTO STUDIO" />
          <ScrollView contentContainerStyle={s.content}>
            <View style={s.preview}>
              <Text style={s.logo}>EP</Text>
              <Text style={s.brand}>PHOTO CANVAS</Text>
              <Text style={s.muted}>YOUR DESIGN WORKSPACE</Text>
            </View>
            {[
              'Import Image', 'Crop', 'Filters', 'Color Grading',
              'Background Remove', 'AI Upscale', '3D Text'
            ].map(x => (
              <Button
                key={x}
                title={x}
                onPress={() => Alert.alert(x, 'This tool needs integration.')}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* PROJECTS */}
      {page === 'projects' && (
        <View style={s.main}>
          <Header title="MY PROJECTS" />
          <View style={s.content}>
            <Text style={s.heading}>RECENT PROJECTS</Text>
            <Text style={s.muted}>
              Your saved projects will appear here.
            </Text>
          </View>
        </View>
      )}

      {/* MEMBERSHIP */}
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
                <Button
                  title="CHOOSE PLAN"
                  onPress={() =>
                    Alert.alert(
                      'Membership',
                      'Payment gateway is not connected yet.'
                    )
                  }
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* SETTINGS */}
      {page === 'settings' && (
        <View style={s.main}>
          <Header title="SETTINGS" />
          <View style={s.content}>
            {[
              'Language', 'Appearance', 'Editor Preferences',
              'Auto Save', 'Notifications', 'Storage', 'Support'
            ].map(x => (
              <View key={x} style={s.setting}>
                <Text style={s.buttonText}>{x}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* EXPORT */}
      {page === 'export' && (
        <View style={s.main}>
          <Header title="EXPORT SETTINGS" />
          <ScrollView contentContainerStyle={s.content}>
            <Text style={s.heading}>RESOLUTION</Text>
            {['720p', '1080p', '2K', '4K', '8K'].map(x => (
              <Button
                key={x}
                title={x}
                onPress={() => setSelectedTool(x)}
                active={selectedTool === x}
              />
            ))}
            <Text style={s.heading}>FRAME RATE</Text>
            {['24 FPS', '30 FPS', '60 FPS', '90 FPS', '120 FPS'].map(x => (
              <Button
                key={x}
                title={x}
                onPress={() => setSelectedTool(x)}
                active={selectedTool === x}
              />
            ))}
            <Button
              title="START EXPORT"
              onPress={() =>
                Alert.alert('Export', 'Export engine is not connected yet.')
              }
            />
          </ScrollView>
        </View>
      )}

      {/* SIDE MENU */}
      {drawer && (
        <View style={s.drawerOverlay}>
          <TouchableOpacity
            style={s.dismiss}
            onPress={() => setDrawer(false)}
          />
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
  safe: {
    flex: 1,
    backgroundColor: C.bg
  },
  main: {
    flex: 1,
    backgroundColor: C.bg
  },
  content: {
    padding: 18,
    paddingBottom: 50
  },
  dashboard: {
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 35
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  dashHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28
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
  menu: {
    color: C.violet,
    fontSize: 25
  },
  profileButton: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileIcon: {
    color: C.violet,
    fontSize: 22
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  welcomeSmall: {
    color: C.cyan,
    fontSize: 9,
    letterSpacing: 2,
    marginBottom: 8
  },
  welcomeTitle: {
    color: C.white,
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  miniLogo: {
    width: 58,
    height: 58,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: C.violet,
    backgroundColor: '#201936',
    alignItems: 'center',
    justifyContent: 'center'
  },
  miniLogoText: {
    color: C.violet,
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: -3
  },
  hero: {
    backgroundColor: '#171327',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#574575',
    padding: 20,
    overflow: 'hidden'
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: C.cyan,
    marginRight: 8
  },
  heroBadge: {
    color: C.cyan,
    fontSize: 8,
    letterSpacing: 1.5,
    fontWeight: '800',
    flex: 1
  },
  heroVersion: {
    color: C.muted,
    fontSize: 9
  },
  heroSmall: {
    color: C.muted,
    fontSize: 9,
    letterSpacing: 2
  },
  heroTitle: {
    color: C.white,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 5
  },
  heroTitleAccent: {
    color: C.violet,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1
  },
  heroDescription: {
    color: C.muted,
    fontSize: 11,
    marginTop: 10
  },
  heroArtwork: {
    height: 165,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 7
  },
  orbitOuter: {
    position: 'absolute',
    width: 145,
    height: 145,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: '#6E58A2',
    transform: [{ rotate: '25deg' }]
  },
  orbitInner: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: C.cyan,
    opacity: 0.55,
    transform: [{ rotate: '-25deg' }]
  },
  heroLogo: {
    color: C.violet,
    fontSize: 70,
    fontWeight: '900',
    letterSpacing: -8,
    textShadowColor: C.violet,
    textShadowRadius: 22
  },
  heroLogoCaption: {
    color: C.cyan,
    fontSize: 8,
    letterSpacing: 4,
    marginTop: -5
  },
  primary: {
    backgroundColor: '#493875',
    borderWidth: 1,
    borderColor: C.violet,
    borderRadius: 13,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  primaryText: {
    color: C.white,
    fontWeight: '900',
    letterSpacing: 1,
    fontSize: 10
  },
  primaryArrow: {
    color: C.cyan,
    fontSize: 17,
    marginLeft: 10
  },
  creditPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#131B29',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#31505C',
    padding: 17,
    marginTop: 14
  },
  creditLeft: {
    flex: 1
  },
  creditLabel: {
    color: C.cyan,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5
  },
  creditNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 5
  },
  creditNumber: {
    color: C.white,
    fontSize: 31,
    fontWeight: '900'
  },
  creditUnit: {
    color: C.violet,
    fontSize: 11,
    fontWeight: '800'
  },
  creditNote: {
    color: C.muted,
    fontSize: 9,
    marginTop: 3
  },
  creditIconBox: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: '#233342',
    borderWidth: 1,
    borderColor: '#426879',
    alignItems: 'center',
    justifyContent: 'center'
  },
  creditIcon: {
    color: C.cyan,
    fontSize: 27
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 29,
    marginBottom: 14
  },
  sectionTitle: {
    color: C.white,
    fontSize: 18,
    fontWeight: '900'
  },
  sectionCaption: {
    color: C.muted,
    fontSize: 8,
    letterSpacing: 1,
    marginTop: 5
  },
  sectionNumber: {
    color: C.violet,
    fontSize: 9,
    fontWeight: '800'
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  actionCard: {
    width: '48.3%',
    minHeight: 132,
    backgroundColor: C.card,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    marginBottom: 10,
    position: 'relative'
  },
  actionWide: {
    width: '100%',
    minHeight: 112,
    backgroundColor: '#211A35',
    borderColor: '#69528D'
  },
  actionIcon: {
    color: C.violet,
    fontSize: 26,
    marginBottom: 13
  },
  actionTitle: {
    color: C.white,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  actionSubtitle: {
    color: C.muted,
    fontSize: 9,
    marginTop: 5
  },
  actionArrow: {
    position: 'absolute',
    right: 13,
    top: 13,
    color: C.cyan,
    fontSize: 16
  },
  workspaceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 13,
    marginBottom: 9
  },
  workspaceIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: '#29213D',
    alignItems: 'center',
    justifyContent: 'center'
  },
  workspaceIconText: {
    color: C.violet,
    fontSize: 20
  },
  workspaceInfo: {
    flex: 1,
    marginLeft: 12
  },
  workspaceTitle: {
    color: C.white,
    fontSize: 11,
    fontWeight: '800'
  },
  workspaceSubtitle: {
    color: C.muted,
    fontSize: 9,
    marginTop: 4
  },
  workspaceArrow: {
    color: C.cyan,
    fontSize: 24,
    paddingHorizontal: 5
  },
  premiumBanner: {
    backgroundColor: '#211A35',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#69528D',
    padding: 20,
    marginTop: 22
  },
  premiumEyebrow: {
    color: C.cyan,
    fontSize: 8,
    letterSpacing: 2,
    fontWeight: '800'
  },
  premiumTitle: {
    color: C.white,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 10
  },
  premiumDescription: {
    color: C.muted,
    fontSize: 10,
    marginTop: 5
  },
  premiumButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#493875',
    borderWidth: 1,
    borderColor: C.violet,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 17
  },
  premiumButtonText: {
    color: C.white,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1
  },
  muted: {
    color: C.muted,
    fontSize: 9,
    marginTop: 6
  },
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
  buttonText: {
    color: C.muted,
    fontSize: 11,
    fontWeight: '700'
  },
  footer: {
    color: C.muted,
    fontSize: 8,
    textAlign: 'center',
    marginTop: 30,
    letterSpacing: 1
  },
  footerSmall: {
    color: '#5D5870',
    fontSize: 7,
    textAlign: 'center',
    marginTop: 7,
    letterSpacing: 2
  },
  headerTitle: {
    color: C.white,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1
  },
  back: {
    color: C.violet,
    fontSize: 32
  },
  projectBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
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
  logo: {
    color: C.violet,
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -5,
    marginVertical: 22,
    textShadowColor: C.violet,
    textShadowRadius: 18
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
  playText: {
    color: C.white,
    fontSize: 18
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 12
  },
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
  selectedTrack: {
    backgroundColor: '#29213D'
  },
  trackName: {
    color: C.white,
    width: 75,
    fontSize: 10
  },
  clip: {
    flex: 1,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  clipText: {
    color: C.white,
    fontSize: 9,
    fontWeight: '700'
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  link: {
    color: C.cyan,
    fontSize: 10,
    fontWeight: '800'
  },
  toolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 15
  },
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
  toolText: {
    color: C.white,
    fontSize: 10,
    textAlign: 'center'
  },
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
  statValue: {
    color: C.white,
    fontSize: 16,
    fontWeight: '900'
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
  dismiss: {
    flex: 1
  },
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
