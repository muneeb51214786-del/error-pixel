import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  StatusBar, StyleSheet, Dimensions, Modal, Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const C = {
  bg: '#070711', white: '#F7F5FF', muted: '#88869F', violet: '#A98BFF',
  cyan: '#80E8F3', pink: '#D9A8F2', glass: 'rgba(255,255,255,0.055)',
  border: 'rgba(210,195,255,0.19)', gold: '#E7D2A0'
};

const SOCIAL_LINKS = [
  { name: 'Facebook', symbol: 'f', color: '#65A8FF', url: 'https://www.facebook.com/share/1CF15iyNv6/' },
  { name: 'Instagram', symbol: '◎', color: '#E9A1E9', url: 'https://www.instagram.com/erroreditx99?srtk=NGdpN2EyMW9tcnhy' },
  { name: 'YouTube', symbol: '▶', color: '#FF777D', url: 'https://m.youtube.com/%40erroreditx-o2t?si=OwHxRUrvYshWYAff&fbclid=PAb21jcAVfscVleHRuA2FlbQIxMQBwZG9mAnNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABp8hgQVs7ApC0-ytIsWeeXzWFc3JzA2cmHKW3jBcyx1oxbv551hthX_Tr5mHa_aem_7Nj6wG1yH3erusMeDiVKcA' },
  { name: 'TikTok', symbol: '♪', color: '#80E8F3', url: 'https://www.tiktok.com/@erroreditx99' }
];

function CrystalLogo({ size = 110 }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', width: size * .77, height: size * .77, borderWidth: 1.5, borderColor: 'rgba(189,157,255,0.8)', transform: [{ rotate: '45deg' }], backgroundColor: 'rgba(117,78,190,0.12)' }} />
      <View style={{ position: 'absolute', width: size * .63, height: size * .63, borderWidth: 1, borderColor: 'rgba(128,232,243,0.6)', transform: [{ rotate: '45deg' }] }} />
      <View style={{ position: 'absolute', width: size * .48, height: size * .48, backgroundColor: 'rgba(151,117,226,0.17)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', transform: [{ rotate: '45deg' }] }} />
      <Text style={{ color: '#FFFFFF', fontSize: size * .31, fontWeight: '900', letterSpacing: -size * .055, textShadowColor: '#B49AFF', textShadowRadius: 16 }}>EP</Text>
      <View style={{ position: 'absolute', width: size * .13, height: 2, backgroundColor: C.cyan, top: size * .12, right: size * .13, transform: [{ rotate: '-45deg' }] }} />
    </View>
  );
}

function GlassCard({ children, style }) { return <View style={[s.glassCard, style]}>{children}</View>; }

function FloatingSocialDock({ onOpen }) {
  return (
    <View style={s.socialDock}>
      {SOCIAL_LINKS.map(item => (
        <TouchableOpacity key={item.name} activeOpacity={0.76} accessibilityRole="button"
          accessibilityLabel={`Open ${item.name}`} onPress={() => onOpen(item.url)} style={s.socialCrystal}>
          <View style={s.socialInner}>
            <Text style={[s.socialSymbol, { color: item.color, textShadowColor: item.color }]}>{item.symbol}</Text>
          </View>
          <View pointerEvents="none" style={s.socialShine} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function App() {
  const [page, setPage] = useState('loading');
  const [drawer, setDrawer] = useState(false);
  const [category, setCategory] = useState('ALL');
  const [appReady, setAppReady] = useState(false);
  const [activeTool, setActiveTool] = useState('Basic');
  const [selectedAction, setSelectedAction] = useState('Trim');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState('Original Video');
  const [clipCount, setClipCount] = useState(1);
  const [projectName, setProjectName] = useState('Untitled Project');

  const toolGroups = {
    Basic: ['Split', 'Delete', 'Duplicate', 'Trim', 'Crop', 'Speed', 'Rotate', 'Canvas', 'Opacity'],
    Animation: ['Keyframes', 'Graph Editor', 'Motion Blur', 'Velocity'],
    '3D Studio': ['3D Text', '3D Objects', 'Camera', 'Lighting', 'Position', 'Rotation', 'Scale'],
    Effects: ['Glow', 'Blur', 'Shake', 'RGB', 'Glitch', 'Particles', 'Transitions'],
    'AI Studio': ['Enhance', 'Upscale', 'Stabilization', 'Noise Reduction', 'Green Screen', 'AI Voice', 'Video Creator', 'Auto Captions', 'Background Remove'],
    Advanced: ['Masking', 'Motion Tracking', 'Blend Modes', 'Color Grading', 'LUTs', 'FPS Booster']
  };


  useEffect(() => {
    let timer;
    let cancelled = false;
    const initializeApp = async () => {
      try {
        const completed = await AsyncStorage.getItem('ERROR_PIXEL_STARTED');
        if (cancelled) return;
        if (completed === 'true') setPage('home');
        else {
          setPage('intro');
          timer = setTimeout(() => { if (!cancelled) setPage('welcome'); }, 2800);
        }
      } catch (error) {
        if (!cancelled) {
          setPage('intro');
          timer = setTimeout(() => { if (!cancelled) setPage('welcome'); }, 2800);
        }
      } finally {
        if (!cancelled) setAppReady(true);
      }
    };
    initializeApp();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, []);

  const enterStudio = async () => {
    try { await AsyncStorage.setItem('ERROR_PIXEL_STARTED', 'true'); }
    catch (error) { console.log('Could not save first-launch preference:', error); }
    setPage('home');
  };
  const openSocial = async (url) => {
    try { await Linking.openURL(url); }
    catch (error) { console.log('Could not open social link:', error); }
  };
  const openPage = target => { setDrawer(false); setPage(target); };
  const menu = [['Dashboard', 'home'], ['Video Editor', 'editor'], ['Photo Studio', 'photo'], ['My Projects', 'projects'], ['Membership', 'membership'], ['Settings', 'settings']];
  const categories = ['ALL', 'VIDEO', 'PHOTO', 'AUDIO', 'DRAFTS'];

  if (!appReady) return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={s.loadingScreen}><CrystalLogo size={90} /><Text style={s.loadingBrand}>ERROR PIXEL</Text><Text style={s.loadingCaption}>PREPARING YOUR CREATIVE STUDIO</Text></View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {page === 'intro' && (
        <View style={s.intro}>
          <View style={s.ambientOne} /><View style={s.ambientTwo} />
          <CrystalLogo size={145} />
          <Text style={s.introBrand}>ERROR <Text style={s.violet}>PIXEL</Text></Text>
          <Text style={s.introTag}>DIAMOND AI CREATIVE STUDIO</Text>
          <View style={s.introLine} /><Text style={s.introPowered}>POWERED BY MUNEEB HASSAN</Text>
        </View>
      )}

      {page === 'welcome' && (
        <View style={s.welcome}>
          <View style={s.ambientOne} /><View style={s.ambientTwo} />
          <View style={s.welcomeTop}><Text style={s.miniBrand}>ERROR PIXEL</Text><Text style={s.version}>CREATOR STUDIO  /  01</Text></View>
          <View style={s.welcomeCenter}>
            <View style={s.logoAura} /><CrystalLogo size={190} />
            <Text style={s.welcomeBrand}>ERROR <Text style={s.violet}>PIXEL</Text></Text>
            <Text style={s.welcomeTag}>DIAMOND AI CREATIVE STUDIO</Text>
            <Text style={s.welcomeDescription}>Your vision. Your creativity. One powerful studio.</Text>
          </View>
          <View style={s.welcomeBottom}>
            <TouchableOpacity style={s.enterButton} onPress={enterStudio}><Text style={s.enterText}>ENTER THE STUDIO</Text><Text style={s.enterArrow}>→</Text></TouchableOpacity>
            <Text style={s.bottomNote}>CREATE WITHOUT LIMITS</Text><Text style={s.introPowered}>POWERED BY MUNEEB HASSAN</Text>
          </View>
        </View>
      )}

      {page === 'home' && (
        <View style={s.main}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.homeContent}>
            <View style={s.topBar}>
              <View style={s.brandRow}><CrystalLogo size={43} /><View><Text style={s.topBrand}>ERROR <Text style={s.violet}>PIXEL</Text></Text><Text style={s.topCaption}>DIAMOND CREATIVE STUDIO</Text></View></View>
              <TouchableOpacity onPress={() => setDrawer(true)} style={s.menuButton}><View style={s.menuLine} /><View style={[s.menuLine, { width: 15 }]} /><View style={s.menuLine} /></TouchableOpacity>
            </View>

            <View style={s.hero}>
              <View style={s.heroGlow} />
              <View style={s.heroTop}><View><Text style={s.heroEyebrow}>THE NEXT GENERATION</Text><Text style={s.heroEyebrow2}>OF CREATIVE EDITING</Text></View><View style={s.proBadge}><Text style={s.proBadgeText}>✦ STUDIO</Text></View></View>
              <View style={s.heroCenter}><CrystalLogo size={125} /><Text style={s.heroHeadline}>CREATE BEYOND</Text><Text style={s.heroHeadlineAccent}>LIMITS.</Text><Text style={s.heroDescription}>An elevated space for your video, photo and motion creativity.</Text></View>
              <TouchableOpacity style={s.newProject} onPress={() => setPage('editor')}>
                <View style={s.newProjectIcon}><Text style={s.plus}>＋</Text></View>
                <View style={{ flex: 1 }}><Text style={s.newProjectTitle}>NEW PROJECT</Text><Text style={s.newProjectSub}>Start creating something extraordinary</Text></View>
                <Text style={s.newProjectArrow}>↗</Text>
              </TouchableOpacity>
              <Text style={s.heroFooter}>ERROR EDITX  /  CREATOR EDITION</Text>
            </View>

            <View style={s.statsRow}>
              <GlassCard style={s.statCard}><Text style={s.statIcon}>✦</Text><Text style={s.statValue}>120</Text><Text style={s.statCaption}>VIOLET CREDITS</Text></GlassCard>
              <GlassCard style={s.statCard}><Text style={s.statIcon}>◇</Text><Text style={s.statValue}>FREE</Text><Text style={s.statCaption}>MEMBERSHIP</Text></GlassCard>
              <GlassCard style={s.statCard}><Text style={s.statIcon}>∞</Text><Text style={s.statValue}>STUDIO</Text><Text style={s.statCaption}>WORKSPACE</Text></GlassCard>
            </View>

            <View style={s.sectionHeader}><View><Text style={s.sectionEyebrow}>YOUR CREATIVE SPACE</Text><Text style={s.sectionTitle}>Explore Studio</Text></View><Text style={s.sectionNumber}>01 / 04</Text></View>
            <View style={s.workspaceGrid}>
              <TouchableOpacity style={s.workspaceLarge} onPress={() => setPage('editor')}><View style={s.workspaceOrb} /><Text style={s.workspaceSymbol}>▣</Text><View><Text style={s.workspaceTitle}>VIDEO</Text><Text style={s.workspaceTitle}>STUDIO</Text><Text style={s.workspaceSub}>PROFESSIONAL EDITING</Text></View><Text style={s.workspaceArrow}>↗</Text></TouchableOpacity>
              <View style={s.workspaceRight}>
                <TouchableOpacity style={s.workspaceSmall} onPress={() => setPage('photo')}><Text style={s.smallSymbol}>◇</Text><Text style={s.workspaceSmallTitle}>PHOTO</Text><Text style={s.workspaceSmallSub}>CANVAS & DESIGN</Text></TouchableOpacity>
                <TouchableOpacity style={[s.workspaceSmall, s.aiWorkspace]} onPress={() => setPage('editor')}><Text style={s.smallSymbol}>✧</Text><Text style={s.workspaceSmallTitle}>AI STUDIO</Text><Text style={s.workspaceSmallSub}>INTELLIGENT TOOLS</Text></TouchableOpacity>
              </View>
            </View>

            <View style={s.sectionHeader}><View><Text style={s.sectionEyebrow}>POWERFUL CREATIVE TOOLS</Text><Text style={s.sectionTitle}>Studio Collection</Text></View><Text style={s.viewAll}>VIEW ALL ↗</Text></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              { [['MOTION', '◌', 'Motion Blur'], ['ENHANCE', '✦', 'AI Enhance'], ['FRAME RATE', '▤', 'FPS Booster'], ['GENERATE', '◇', 'AI Creator']].map(item => (
                <TouchableOpacity key={item[0]} style={s.collectionCard} onPress={() => setPage('editor')}><Text style={s.collectionIcon}>{item[1]}</Text><Text style={s.collectionType}>{item[0]}</Text><Text style={s.collectionName}>{item[2]}</Text><Text style={s.collectionArrow}>↗</Text></TouchableOpacity>
              ))}
            </ScrollView>

            <View style={s.sectionHeader}><View><Text style={s.sectionEyebrow}>YOUR CREATIVE JOURNEY</Text><Text style={s.sectionTitle}>Recent Projects</Text></View><TouchableOpacity onPress={() => setPage('projects')}><Text style={s.viewAll}>SEE ALL ↗</Text></TouchableOpacity></View>
            <GlassCard style={s.emptyProjects}><View style={s.emptyCrystal}><CrystalLogo size={62} /></View><Text style={s.emptyTitle}>A blank canvas awaits.</Text><Text style={s.emptyDescription}>Your projects will appear here once you start creating.</Text><TouchableOpacity onPress={() => setPage('editor')}><Text style={s.emptyLink}>CREATE YOUR FIRST PROJECT  ↗</Text></TouchableOpacity></GlassCard>

            <View style={s.membershipBanner}><Text style={s.memberEyebrow}>UNLOCK YOUR CREATIVE POTENTIAL</Text><Text style={s.memberTitle}>THE PREMIUM EXPERIENCE.</Text><Text style={s.memberDescription}>Discover advanced creative tools and premium studio access.</Text><TouchableOpacity onPress={() => setPage('membership')} style={s.memberButton}><Text style={s.memberButtonText}>EXPLORE MEMBERSHIP  →</Text></TouchableOpacity></View>
            <View style={s.socialFooter}><Text style={s.footerBrand}>ERROR PIXEL</Text><Text style={s.footerTag}>DESIGNED TO CREATE DIFFERENTLY.</Text><Text style={s.footerCopyright}>POWERED BY MUNEEB HASSAN</Text></View>
          </ScrollView>
          <FloatingSocialDock onOpen={openSocial} />
        </View>
      )}

      {page !== 'intro' && page !== 'welcome' && page !== 'home' && (
        <View style={s.main}>
          <View style={s.subHeader}><TouchableOpacity onPress={() => setPage('home')}><Text style={s.back}>‹</Text></TouchableOpacity><Text style={s.subHeaderTitle}>{page === 'editor' ? 'EDIT STUDIO' : page === 'photo' ? 'PHOTO STUDIO' : page === 'projects' ? 'MY PROJECTS' : page === 'membership' ? 'MEMBERSHIP' : 'SETTINGS'}</Text><TouchableOpacity onPress={() => setDrawer(true)}><Text style={s.more}>•••</Text></TouchableOpacity></View>
          {page === 'editor' && (
            <ScrollView style={s.editorScroll} contentContainerStyle={s.editorPage} showsVerticalScrollIndicator={false}>
              <View style={s.editorProjectBar}>
                <View><Text style={s.editorEyebrow}>CREATIVE WORKSPACE</Text><Text style={s.editorProjectName}>{projectName}</Text></View>
                <TouchableOpacity style={s.editorSaveButton} onPress={() => setProjectName('Project Saved')}><Text style={s.editorSaveText}>SAVE</Text></TouchableOpacity>
              </View>
              <View style={s.editorPreview}>
                <View style={s.previewTopLine}><Text style={s.previewTopText}>PREVIEW MONITOR</Text><Text style={s.previewTopText}>16:9  •  00:00</Text></View>
                <View style={s.previewCenter}><View style={s.previewFrame}><CrystalLogo size={74} /><Text style={s.previewBrand}>ERROR PIXEL</Text><Text style={s.previewSubBrand}>YOUR CREATIVE TIMELINE</Text></View></View>
                <View style={s.previewControls}>
                  <Text style={s.timeCode}>00:00:00:00</Text>
                  <TouchableOpacity style={s.playButton} onPress={() => setIsPlaying(!isPlaying)}><Text style={s.playButtonText}>{isPlaying ? 'Ⅱ' : '▶'}</Text></TouchableOpacity>
                  <Text style={s.timeCode}>00:00:15:00</Text>
                </View>
              </View>
              <View style={s.quickActions}>
                {['＋ Import', '↶ Undo', '↷ Redo', '⇧ Export'].map((a, i) => <TouchableOpacity key={a} style={s.quickAction} onPress={() => setSelectedAction(a.replace('＋ ',''))}><Text style={s.quickActionText}>{a}</Text></TouchableOpacity>)}
              </View>
              <View style={s.timelineTitleRow}><View><Text style={s.sectionEyebrow}>MULTI-TRACK EDITOR</Text><Text style={s.sectionTitle}>Timeline</Text></View><Text style={s.timelineDuration}>00:15:00</Text></View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.rulerScroll}><View style={s.ruler}><Text style={s.rulerText}>00:00</Text><Text style={s.rulerText}>00:03</Text><Text style={s.rulerText}>00:06</Text><Text style={s.rulerText}>00:09</Text><Text style={s.rulerText}>00:12</Text><Text style={s.rulerText}>00:15</Text></View></ScrollView>
              {[
                {name:'Original Video', color:'#8D72D8', symbol:'▣'},
                {name:'Audio / Sound', color:'#397E91', symbol:'♫'},
                {name:'Overlay', color:'#9B659F', symbol:'◇'},
                {name:'Effects', color:'#A47B4E', symbol:'✦'},
                {name:'Stickers', color:'#4C927D', symbol:'☆'},
                {name:'Text', color:'#547CB4', symbol:'T'}
              ].map((track, i) => (
                <TouchableOpacity key={track.name} activeOpacity={0.9} onPress={() => setSelectedLayer(track.name)} style={[s.trackRow, selectedLayer === track.name && s.trackRowSelected]}>
                  <View style={s.trackLabel}><Text style={[s.trackSymbol,{color:track.color}]}>{track.symbol}</Text><Text style={s.trackName}>{track.name}</Text></View>
                  <View style={s.trackLane}><View style={[s.trackClipBlock,{backgroundColor:track.color, width: i===0 ? 184 + Math.min(clipCount-1,3)*22 : [0,145,105,125,85,115][i]}]}><Text style={s.trackClipText}>{i===0 ? `Video Clip ${clipCount}` : track.name}</Text></View></View>
                </TouchableOpacity>
              ))}
              <View style={s.timelineActionRow}>
                {['＋ Add Track','Split','Duplicate','Delete'].map((a) => <TouchableOpacity key={a} style={s.timelineAction} onPress={() => {setSelectedAction(a); if(a==='Duplicate') setClipCount(v=>v+1); if(a==='Delete') setClipCount(v=>Math.max(0,v-1));}}><Text style={s.timelineActionText}>{a}</Text></TouchableOpacity>)}
              </View>
              <Text style={s.sectionTitle}>Editing Tools</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.toolCategoryScroll}>
                {Object.keys(toolGroups).map(group => <TouchableOpacity key={group} onPress={() => {setActiveTool(group);setSelectedAction(toolGroups[group][0]);}} style={[s.toolCategory,activeTool===group && s.toolCategoryActive]}><Text style={[s.toolCategoryText,activeTool===group && s.toolCategoryTextActive]}>{group}</Text></TouchableOpacity>)}
              </ScrollView>
              <View style={s.toolPanel}>
                <View style={s.toolPanelHeader}><Text style={s.toolPanelTitle}>{activeTool.toUpperCase()} TOOLS</Text><Text style={s.toolPanelHint}>SELECT A TOOL</Text></View>
                <View style={s.toolGrid}>{toolGroups[activeTool].map((tool, index) => <TouchableOpacity key={tool} onPress={() => setSelectedAction(tool)} style={[s.toolTile,selectedAction===tool && s.toolTileActive]}><Text style={[s.toolTileIcon,selectedAction===tool && s.toolTileIconActive]}>{['✦','◇','◌','▣','⌁','T','◈','↗','◎'][index%9]}</Text><Text style={[s.toolTileText,selectedAction===tool && s.toolTileTextActive]}>{tool}</Text></TouchableOpacity>)}</View>
                <View style={s.toolSettings}><View style={{flex:1}}><Text style={s.toolSettingsTitle}>{selectedAction}</Text><Text style={s.toolSettingsCaption}>Selected tool • {selectedLayer}</Text></View><TouchableOpacity style={s.applyToolButton} onPress={() => setSelectedAction(`${selectedAction} ✓`)}><Text style={s.applyToolText}>APPLY</Text></TouchableOpacity></View>
              </View>
              <Text style={s.engineNotice}>INTERFACE PREVIEW · Media import, rendering, AI processing and export engines still need to be integrated.</Text>
            </ScrollView>
          )}
          {page === 'photo' && (
            <ScrollView contentContainerStyle={s.subContent}><View style={s.mediaPreview}><CrystalLogo size={85} /><Text style={s.previewLabel}>CREATIVE CANVAS</Text><Text style={s.previewHint}>Your design workspace</Text></View><View style={s.editorTools}>{['Canvas', 'Crop', 'Background Blur', '3D Photo', '3D Text', 'Image Shadow', 'Text Shadow', 'AI Image Create', 'Stickers', 'Filters', 'Color Grading', 'Upscale'].map(name => <TouchableOpacity key={name} style={s.editorTool}><Text style={s.editorToolText}>{name}</Text></TouchableOpacity>)}</View></ScrollView>
          )}
          {page === 'projects' && <View style={s.subContent}>{categories.map(item => <TouchableOpacity key={item} onPress={() => setCategory(item)} style={[s.category, category === item && s.categoryActive]}><Text style={s.categoryText}>{item} PROJECTS</Text><Text style={s.arrow}>↗</Text></TouchableOpacity>)}<Text style={s.previewHint}>Your saved projects will appear here.</Text></View>}
          {page === 'membership' && (
            <ScrollView contentContainerStyle={s.subContent}>{[['WEEKLY', 'Rs. 350', '150 Credits'], ['MONTHLY', 'Rs. 1,200', '800 Credits'], ['YEARLY', 'Rs. 9,000', '10,000 Credits'], ['LIFETIME', 'Rs. 30,000', 'Unlimited Premium Use']].map(item => <GlassCard key={item[0]} style={s.plan}><Text style={s.planName}>{item[0]}</Text><Text style={s.planPrice}>{item[1]}</Text><Text style={s.planCredits}>{item[2]}</Text><Text style={s.planAction}>CHOOSE PLAN  →</Text></GlassCard>)}<Text style={s.previewHint}>Payment integration is not connected.</Text></ScrollView>
          )}
          {page === 'settings' && <View style={s.subContent}>{['Language', 'Appearance', 'Editor Preferences', 'Auto Save', 'Notifications', 'Storage', 'Support'].map(name => <View key={name} style={s.category}><Text style={s.categoryText}>{name}</Text><Text style={s.arrow}>›</Text></View>)}</View>}
        </View>
      )}

      <Modal visible={drawer} transparent animationType="fade" onRequestClose={() => setDrawer(false)}>
        <View style={s.drawerBackdrop}><TouchableOpacity style={{ flex: 1 }} onPress={() => setDrawer(false)} /><View style={s.drawer}>
          <View style={s.drawerLogo}><CrystalLogo size={65} /><View><Text style={s.drawerBrand}>ERROR PIXEL</Text><Text style={s.drawerSub}>CREATIVE STUDIO</Text></View></View>
          <View style={s.drawerDivider} />
          {menu.map(item => <TouchableOpacity key={item[1]} style={s.drawerItem} onPress={() => openPage(item[1])}><Text style={s.drawerItemText}>{item[0]}</Text><Text style={s.drawerArrow}>↗</Text></TouchableOpacity>)}
          <View style={s.drawerBottom}><Text style={s.drawerSub}>ERROR EDITX</Text><Text style={s.drawerSub}>VERSION 01.0</Text></View>
        </View></View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg }, main: { flex: 1, backgroundColor: C.bg },
  loadingScreen: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  loadingBrand: { color: C.white, fontSize: 18, fontWeight: '900', letterSpacing: 3, marginTop: 22 },
  loadingCaption: { color: C.cyan, fontSize: 7, letterSpacing: 2, marginTop: 10 },
  intro: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  ambientOne: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(117,75,205,0.13)', top: '17%', left: -150 },
  ambientTwo: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(55,163,190,0.09)', bottom: '12%', right: -145 },
  introBrand: { color: C.white, fontSize: 29, fontWeight: '900', letterSpacing: 3, marginTop: 37 },
  violet: { color: C.violet }, introTag: { color: C.cyan, fontSize: 9, letterSpacing: 3, marginTop: 12 },
  introLine: { width: 65, height: 1, backgroundColor: C.violet, marginTop: 30 },
  introPowered: { color: C.muted, fontSize: 8, letterSpacing: 2, marginTop: 20 },
  welcome: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 25, justifyContent: 'space-between', overflow: 'hidden' },
  welcomeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24 },
  miniBrand: { color: C.white, fontSize: 11, fontWeight: '900', letterSpacing: 2 }, version: { color: C.muted, fontSize: 7, letterSpacing: 1 },
  welcomeCenter: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  logoAura: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(137,95,220,0.08)' },
  welcomeBrand: { color: C.white, fontSize: 30, fontWeight: '900', letterSpacing: 2, marginTop: 30 },
  welcomeTag: { color: C.cyan, fontSize: 8, letterSpacing: 2.5, marginTop: 12 },
  welcomeDescription: { color: C.muted, fontSize: 11, marginTop: 24, textAlign: 'center', letterSpacing: .5 },
  welcomeBottom: { paddingBottom: 30, alignItems: 'center' },
  enterButton: { width: '100%', height: 58, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(207,184,255,0.55)', backgroundColor: 'rgba(139,103,209,0.22)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  enterText: { color: C.white, fontSize: 11, fontWeight: '900', letterSpacing: 2 }, enterArrow: { color: C.cyan, fontSize: 20, marginLeft: 14 },
  bottomNote: { color: C.violet, fontSize: 8, letterSpacing: 2, marginTop: 22 },
  homeContent: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 115 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginLeft: -4 },
  topBrand: { color: C.white, fontSize: 16, fontWeight: '900', letterSpacing: 1.5 }, topCaption: { color: C.cyan, fontSize: 6, letterSpacing: 1.5, marginTop: 4 },
  menuButton: { width: 45, height: 45, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.055)', borderWidth: 1, borderColor: C.border, justifyContent: 'center', alignItems: 'center', gap: 4 },
  menuLine: { height: 1.5, width: 19, backgroundColor: C.white },
  hero: { borderRadius: 25, borderWidth: 1, borderColor: 'rgba(193,163,255,0.36)', backgroundColor: '#141121', padding: 19, overflow: 'hidden' },
  heroGlow: { position: 'absolute', width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(135,89,220,0.13)', top: 35, left: (width - 250) / 2 - 18 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between' },
  heroEyebrow: { color: C.cyan, fontSize: 8, letterSpacing: 1.7, fontWeight: '800' }, heroEyebrow2: { color: C.muted, fontSize: 7, letterSpacing: 1.5, marginTop: 5 },
  proBadge: { borderWidth: 1, borderColor: 'rgba(231,210,160,0.5)', backgroundColor: 'rgba(231,210,160,0.09)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  proBadgeText: { color: C.gold, fontSize: 7, letterSpacing: 1 }, heroCenter: { alignItems: 'center', paddingTop: 20, paddingBottom: 22 },
  heroHeadline: { color: C.white, fontSize: 24, fontWeight: '900', letterSpacing: 1.5, marginTop: 15 },
  heroHeadlineAccent: { color: C.violet, fontSize: 25, fontWeight: '900', letterSpacing: 3 },
  heroDescription: { color: C.muted, fontSize: 10, lineHeight: 17, textAlign: 'center', marginTop: 12, maxWidth: 250 },
  newProject: { flexDirection: 'row', alignItems: 'center', borderRadius: 15, padding: 12, backgroundColor: 'rgba(255,255,255,0.075)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.19)' },
  newProjectIcon: { width: 39, height: 39, borderRadius: 12, backgroundColor: 'rgba(169,139,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  plus: { color: C.white, fontSize: 24 }, newProjectTitle: { color: C.white, fontSize: 11, fontWeight: '900', letterSpacing: 1 }, newProjectSub: { color: C.muted, fontSize: 8, marginTop: 4 }, newProjectArrow: { color: C.cyan, fontSize: 20, paddingHorizontal: 5 },
  heroFooter: { color: '#827A9B', fontSize: 7, textAlign: 'center', letterSpacing: 1.5, marginTop: 16 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 13 },
  glassCard: { backgroundColor: 'rgba(255,255,255,0.045)', borderWidth: 1, borderColor: C.border, borderRadius: 16 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 13 }, statIcon: { color: C.cyan, fontSize: 15 }, statValue: { color: C.white, fontSize: 13, fontWeight: '900', marginTop: 7 }, statCaption: { color: C.muted, fontSize: 6, letterSpacing: 1, marginTop: 5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 29, marginBottom: 13 },
  sectionEyebrow: { color: C.cyan, fontSize: 7, letterSpacing: 1.7 }, sectionTitle: { color: C.white, fontSize: 19, fontWeight: '800', marginTop: 5 }, sectionNumber: { color: C.muted, fontSize: 8, letterSpacing: 1 },
  workspaceGrid: { flexDirection: 'row', gap: 10 },
  workspaceLarge: { width: '49%', minHeight: 210, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(169,139,255,0.45)', backgroundColor: '#19152A', padding: 14, justifyContent: 'space-between', overflow: 'hidden' },
  workspaceOrb: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(143,105,220,0.16)', top: -45, right: -55 },
  workspaceSymbol: { color: C.violet, fontSize: 31 }, workspaceTitle: { color: C.white, fontSize: 18, fontWeight: '900', letterSpacing: 1 }, workspaceSub: { color: C.cyan, fontSize: 6, letterSpacing: 1, marginTop: 8 },
  workspaceArrow: { color: C.white, fontSize: 19, position: 'absolute', bottom: 12, right: 14 }, workspaceRight: { flex: 1, gap: 10 },
  workspaceSmall: { flex: 1, borderRadius: 17, padding: 12, backgroundColor: '#13202A', borderWidth: 1, borderColor: 'rgba(128,232,243,0.28)', justifyContent: 'center' },
  aiWorkspace: { backgroundColor: '#21182B', borderColor: 'rgba(217,168,242,0.32)' }, smallSymbol: { color: C.cyan, fontSize: 23, marginBottom: 5 },
  workspaceSmallTitle: { color: C.white, fontSize: 12, fontWeight: '900' }, workspaceSmallSub: { color: C.muted, fontSize: 6, marginTop: 4, letterSpacing: .8 }, viewAll: { color: C.cyan, fontSize: 8, letterSpacing: 1 },
  collectionCard: { width: 132, height: 125, marginRight: 10, borderRadius: 17, padding: 13, backgroundColor: '#171424', borderWidth: 1, borderColor: C.border, justifyContent: 'space-between' },
  collectionIcon: { color: C.violet, fontSize: 23 }, collectionType: { color: C.cyan, fontSize: 7, letterSpacing: 1 }, collectionName: { color: C.white, fontSize: 11, fontWeight: '800' }, collectionArrow: { color: C.muted, position: 'absolute', right: 12, top: 12 },
  emptyProjects: { padding: 18, alignItems: 'center' }, emptyCrystal: { marginVertical: 7 }, emptyTitle: { color: C.white, fontSize: 13, fontWeight: '800', marginTop: 12 },
  emptyDescription: { color: C.muted, fontSize: 9, lineHeight: 15, textAlign: 'center', marginTop: 7 }, emptyLink: { color: C.cyan, fontSize: 8, letterSpacing: 1, marginTop: 16 },
  membershipBanner: { marginTop: 25, borderRadius: 20, padding: 19, backgroundColor: '#211B2D', borderWidth: 1, borderColor: 'rgba(231,210,160,0.34)' },
  memberEyebrow: { color: C.gold, fontSize: 7, letterSpacing: 1.5 }, memberTitle: { color: C.white, fontSize: 19, fontWeight: '900', marginTop: 12 }, memberDescription: { color: C.muted, fontSize: 9, lineHeight: 16, marginTop: 8 },
  memberButton: { alignSelf: 'flex-start', padding: 12, paddingHorizontal: 15, borderRadius: 10, backgroundColor: 'rgba(231,210,160,0.14)', borderWidth: 1, borderColor: 'rgba(231,210,160,0.4)', marginTop: 15 }, memberButtonText: { color: C.gold, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  socialFooter: { alignItems: 'center', paddingVertical: 30 }, footerBrand: { color: C.white, fontSize: 12, fontWeight: '900', letterSpacing: 3 }, footerTag: { color: C.cyan, fontSize: 7, letterSpacing: 1.5, marginTop: 8 }, footerCopyright: { color: C.muted, fontSize: 7, marginTop: 14 },
  socialDock: { position: 'absolute', bottom: 12, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15, paddingHorizontal: 17, paddingVertical: 10, borderRadius: 24, backgroundColor: 'rgba(19,15,34,0.94)', borderWidth: 1, borderColor: 'rgba(200,180,255,0.42)', shadowColor: '#A98BFF', shadowOpacity: 0.35, shadowRadius: 16, elevation: 14 },
  socialCrystal: { width: 47, height: 47, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(169,139,255,0.16)', borderWidth: 1, borderColor: 'rgba(220,205,255,0.62)', transform: [{ rotate: '45deg' }], overflow: 'hidden' },
  socialInner: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-45deg' }] }, socialSymbol: { fontSize: 23, fontWeight: '900', textShadowRadius: 12 },
  socialShine: { position: 'absolute', top: 3, left: 7, width: 19, height: 1, backgroundColor: 'rgba(255,255,255,0.72)', transform: [{ rotate: '-45deg' }] },
  subHeader: { height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 1, borderColor: C.border },
  back: { color: C.white, fontSize: 29 }, more: { color: C.white, fontSize: 17, letterSpacing: 2 }, subHeaderTitle: { color: C.white, fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
  subContent: { padding: 18, paddingBottom: 40 }, mediaPreview: { height: 220, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: '#151222', borderWidth: 1, borderColor: C.border, marginBottom: 22 },
  previewLabel: { color: C.white, fontSize: 11, fontWeight: '900', marginTop: 12 }, previewHint: { color: C.muted, fontSize: 9, marginTop: 8, lineHeight: 15 }, timelineHeading: { marginBottom: 15 },
  layer: { height: 53, marginBottom: 7, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.045)', borderWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, overflow: 'hidden' },
  layerName: { color: C.white, fontSize: 9, width: 105, fontWeight: '700' }, layerClip: { height: 29, borderRadius: 6, backgroundColor: 'rgba(169,139,255,0.2)', borderWidth: 1, borderColor: 'rgba(169,139,255,0.5)', justifyContent: 'center', paddingHorizontal: 7 }, layerClipText: { color: C.white, fontSize: 8 },
  editorTools: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 15 }, editorTool: { padding: 12, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: C.border }, editorToolText: { color: C.white, fontSize: 9 },
  category: { flexDirection: 'row', justifyContent: 'space-between', padding: 17, borderRadius: 13, marginBottom: 9, backgroundColor: C.glass, borderWidth: 1, borderColor: C.border }, categoryActive: { borderColor: C.violet, backgroundColor: 'rgba(169,139,255,0.13)' }, categoryText: { color: C.white, fontSize: 10, fontWeight: '800', letterSpacing: 1 }, arrow: { color: C.cyan, fontSize: 17 },
  plan: { padding: 18, marginBottom: 12 }, planName: { color: C.cyan, fontSize: 10, letterSpacing: 2, fontWeight: '900' }, planPrice: { color: C.white, fontSize: 26, fontWeight: '900', marginTop: 12 }, planCredits: { color: C.muted, fontSize: 10, marginTop: 5 }, planAction: { color: C.gold, fontSize: 9, letterSpacing: 1, marginTop: 20 },
  drawerBackdrop: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.72)' }, drawer: { width: '82%', backgroundColor: '#100E1A', padding: 20, paddingTop: 45, borderRightWidth: 1, borderColor: C.border },
  drawerLogo: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 }, drawerBrand: { color: C.white, fontSize: 16, fontWeight: '900', letterSpacing: 1 }, drawerSub: { color: C.cyan, fontSize: 7, letterSpacing: 1.5, marginTop: 5 },
  drawerDivider: { height: 1, backgroundColor: C.border, marginBottom: 15 }, drawerItem: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  drawerItemText: { color: C.white, fontSize: 11, fontWeight: '800', letterSpacing: 1 }, drawerArrow: { color: C.violet, fontSize: 17 }, drawerBottom: { marginTop: 'auto', paddingTop: 25 },
  editorScroll: { flex: 1 }, editorPage: { padding: 15, paddingBottom: 42 },
  editorProjectBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }, editorEyebrow: { color: C.cyan, fontSize: 7, letterSpacing: 1.7 }, editorProjectName: { color: C.white, fontSize: 16, fontWeight: '900', marginTop: 5 }, editorSaveButton: { paddingHorizontal: 17, paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(169,139,255,0.18)', borderWidth: 1, borderColor: C.violet }, editorSaveText: { color: C.white, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  editorPreview: { backgroundColor: '#0D0C17', borderRadius: 17, borderWidth: 1, borderColor: C.border, padding: 10, marginBottom: 11 }, previewTopLine: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 3 }, previewTopText: { color: C.muted, fontSize: 7, letterSpacing: 1 }, previewCenter: { height: 205, alignItems: 'center', justifyContent: 'center' }, previewFrame: { width: '83%', aspectRatio: 16/9, backgroundColor: '#171326', borderWidth: 1, borderColor: 'rgba(169,139,255,0.42)', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }, previewBrand: { color: C.white, fontSize: 12, fontWeight: '900', letterSpacing: 2, marginTop: 4 }, previewSubBrand: { color: C.cyan, fontSize: 6, letterSpacing: 1.5, marginTop: 5 }, previewControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 }, timeCode: { color: C.muted, fontSize: 9, fontVariant: ['tabular-nums'] }, playButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(169,139,255,0.22)', borderWidth: 1, borderColor: C.violet, alignItems: 'center', justifyContent: 'center' }, playButtonText: { color: C.white, fontSize: 14 },
  quickActions: { flexDirection: 'row', gap: 7, marginBottom: 22 }, quickAction: { flex: 1, paddingVertical: 11, borderRadius: 9, alignItems: 'center', backgroundColor: C.glass, borderWidth: 1, borderColor: C.border }, quickActionText: { color: C.white, fontSize: 8, fontWeight: '800' }, timelineTitleRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }, timelineDuration: { color: C.cyan, fontSize: 9, marginBottom: 4 }, rulerScroll: { marginBottom: 5 }, ruler: { width: 520, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 112, paddingVertical: 7, borderBottomWidth: 1, borderColor: C.border }, rulerText: { color: C.muted, fontSize: 7 },
  trackRow: { minHeight: 48, flexDirection: 'row', borderRadius: 9, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.025)', marginBottom: 5, overflow: 'hidden' }, trackRowSelected: { borderColor: 'rgba(169,139,255,0.7)', backgroundColor: 'rgba(169,139,255,0.07)' }, trackLabel: { width: 108, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, borderRightWidth: 1, borderColor: C.border }, trackSymbol: { fontSize: 13, marginRight: 6 }, trackName: { color: C.white, fontSize: 8, fontWeight: '700' }, trackLane: { flex: 1, justifyContent: 'center', paddingHorizontal: 7 }, trackClipBlock: { height: 29, borderRadius: 6, justifyContent: 'center', paddingHorizontal: 8, opacity: 0.88 }, trackClipText: { color: '#FFFFFF', fontSize: 7, fontWeight: '800' }, timelineActionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 7, marginBottom: 22 }, timelineAction: { paddingHorizontal: 10, paddingVertical: 9, borderRadius: 8, backgroundColor: 'rgba(169,139,255,0.10)', borderWidth: 1, borderColor: C.border }, timelineActionText: { color: C.white, fontSize: 8, fontWeight: '700' },
  toolCategoryScroll: { marginTop: 12, marginBottom: 11 }, toolCategory: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, marginRight: 7, borderWidth: 1, borderColor: C.border, backgroundColor: C.glass }, toolCategoryActive: { backgroundColor: 'rgba(169,139,255,0.22)', borderColor: C.violet }, toolCategoryText: { color: C.muted, fontSize: 8, fontWeight: '800' }, toolCategoryTextActive: { color: C.white }, toolPanel: { padding: 12, borderRadius: 15, backgroundColor: '#12101E', borderWidth: 1, borderColor: C.border }, toolPanelHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 11 }, toolPanelTitle: { color: C.white, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 }, toolPanelHint: { color: C.muted, fontSize: 7, letterSpacing: 1 }, toolGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, toolTile: { width: '31.5%', minHeight: 68, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.035)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', padding: 7 }, toolTileActive: { backgroundColor: 'rgba(169,139,255,0.16)', borderColor: C.violet }, toolTileIcon: { color: C.muted, fontSize: 17, marginBottom: 5 }, toolTileIconActive: { color: C.cyan }, toolTileText: { color: C.white, fontSize: 8, textAlign: 'center', fontWeight: '700' }, toolTileTextActive: { color: C.cyan }, toolSettings: { flexDirection: 'row', alignItems: 'center', marginTop: 13, padding: 11, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.045)' }, toolSettingsTitle: { color: C.white, fontSize: 10, fontWeight: '900' }, toolSettingsCaption: { color: C.muted, fontSize: 7, marginTop: 4 }, applyToolButton: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 8, backgroundColor: 'rgba(128,232,243,0.13)', borderWidth: 1, borderColor: 'rgba(128,232,243,0.45)' }, applyToolText: { color: C.cyan, fontSize: 8, fontWeight: '900', letterSpacing: 1 }, engineNotice: { color: C.muted, fontSize: 7, lineHeight: 13, textAlign: 'center', marginTop: 14, letterSpacing: 0.4 }
});
