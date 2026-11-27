// ERROR PIXEL timeline engine — deterministic, non-destructive editing model.
const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const clone = value => JSON.parse(JSON.stringify(value));
const clamp = (value, min, max) => Math.min(max, Math.max(min, finite(value, min)));
export const PROJECT_SCHEMA_VERSION = 2;
export const TRACKS = [
  { id: 'video-1', type: 'video', name: 'VIDEO', order: 0 },
  { id: 'overlay-1', type: 'image', name: 'OVERLAY', order: 1 },
  { id: 'text-1', type: 'text', name: 'TEXT', order: 2 },
  { id: 'audio-1', type: 'audio', name: 'AUDIO', order: 3 },
  { id: 'effects-1', type: 'effect', name: 'EFFECTS', order: 4 }
];
export const makeTimelineClip = (asset, start = 0) => {
  const seconds = Math.max(0, finite(asset.duration) / 1000);
  const fallback = asset.type === 'image' ? 5 : asset.type === 'audio' ? 30 : 15;
  const duration = seconds || fallback;
  const type = ['video', 'audio', 'image'].includes(asset.type) ? asset.type : 'video';
  return {
    id: 'clip-' + asset.id, assetId: asset.id,
    trackId: type === 'video' ? 'video-1' : type === 'audio' ? 'audio-1' : 'overlay-1',
    type, name: asset.name || 'Untitled media', uri: asset.uri || '',
    start: Math.max(0, finite(start)), sourceIn: 0, sourceOut: duration, duration,
    playbackRate: 1, volume: 1, muted: false, effects: [], keyframes: [],
    transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 }
  };
};
export const normalizeClip = (input, index = 0) => {
  const clip = input || {};
  const duration = Math.max(0.05, finite(clip.duration, 5));
  const sourceIn = Math.max(0, finite(clip.sourceIn));
  const sourceOut = Math.max(sourceIn + 0.05, finite(clip.sourceOut, sourceIn + duration));
  return {
    ...clip,
    id: String(clip.id || 'clip-recovered-' + index),
    trackId: String(clip.trackId || (clip.type === 'audio' ? 'audio-1' : clip.type === 'image' ? 'overlay-1' : 'video-1')),
    type: clip.type || 'video',
    start: Math.max(0, finite(clip.start)),
    sourceIn, sourceOut,
    duration: Math.max(0.05, Math.min(duration, sourceOut - sourceIn)),
    playbackRate: clamp(clip.playbackRate || 1, 0.05, 16),
    volume: clamp(clip.volume == null ? 1 : clip.volume, 0, 2),
    effects: Array.isArray(clip.effects) ? clip.effects : [],
    keyframes: Array.isArray(clip.keyframes) ? clip.keyframes : [],
    transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, ...(clip.transform || {}) }
  };
};
export const normalizeTimeline = clips => {
  const seen = new Set();
  return (Array.isArray(clips) ? clips : []).map(normalizeClip).map((clip, i) => {
    let id = clip.id;
    while (seen.has(id)) id = id + '-' + (i + 1);
    seen.add(id);
    return id === clip.id ? clip : { ...clip, id };
  }).sort((a, b) => a.start - b.start || a.trackId.localeCompare(b.trackId));
};
export const splitTimelineClip = (clips, clipId, atTime) => {
  const source = normalizeTimeline(clips);
  const clip = source.find(item => item.id === clipId);
  if (!clip) return source;
  const local = finite(atTime) - clip.start;
  if (local <= 0.05 || local >= clip.duration - 0.05) return source;
  const splitSource = clip.sourceIn + local * clip.playbackRate;
  const left = { ...clip, duration: local, sourceOut: splitSource };
  const right = {
    ...clip, id: clip.id + '-split-' + Math.round(atTime * 1000),
    start: finite(atTime), sourceIn: splitSource,
    duration: clip.duration - local, sourceOut: clip.sourceOut,
    keyframes: clip.keyframes.filter(k => finite(k.time) >= local).map(k => ({ ...k, time: finite(k.time) - local }))
  };
  return normalizeTimeline(source.flatMap(item => item.id === clipId ? [left, right] : [item]));
};
export const trimClip = (clips, clipId, edge, amount) => normalizeTimeline(clips).map(clip => {
  if (clip.id !== clipId) return clip;
  const delta = finite(amount);
  if (edge === 'left') {
    const applied = clamp(delta, -clip.start, clip.duration - 0.05);
    return { ...clip, start: clip.start + applied, sourceIn: clip.sourceIn + applied * clip.playbackRate, duration: clip.duration - applied, sourceOut: clip.sourceOut };
  }
  const nextDuration = clamp(clip.duration + delta, 0.05, clip.duration + Math.max(0, clip.sourceOut - clip.sourceIn - clip.duration));
  return { ...clip, duration: nextDuration, sourceOut: clip.sourceIn + nextDuration * clip.playbackRate };
});
export const moveClip = (clips, clipId, newStart, trackId) => normalizeTimeline(clips).map(clip =>
  clip.id === clipId ? { ...clip, start: Math.max(0, finite(newStart)), trackId: trackId || clip.trackId } : clip
);
export const duplicateClip = (clips, clipId, offset = null) => {
  const source = normalizeTimeline(clips);
  const clip = source.find(item => item.id === clipId);
  if (!clip) return source;
  const copy = clone(clip);
  copy.id = clip.id + '-copy-' + Date.now().toString(36);
  copy.start = Math.max(0, clip.start + (offset == null ? clip.duration : finite(offset)));
  copy.name = (clip.name || 'Clip') + ' copy';
  return normalizeTimeline([...source, copy]);
};
export const deleteClip = (clips, clipId) => normalizeTimeline(clips).filter(clip => clip.id !== clipId);
export const addEffectToClip = (clips, clipId, effect) => normalizeTimeline(clips).map(clip =>
  clip.id === clipId ? { ...clip, effects: [...clip.effects, { id: 'fx-' + Date.now().toString(36), enabled: true, parameters: {}, ...effect }] } : clip
);
export const setClipKeyframe = (clips, clipId, property, time, value) => normalizeTimeline(clips).map(clip => {
  if (clip.id !== clipId) return clip;
  const keyframe = { property, time: clamp(time, 0, clip.duration), value, interpolation: 'bezier' };
  const rest = clip.keyframes.filter(k => !(k.property === property && Math.abs(finite(k.time) - keyframe.time) < 0.001));
  return { ...clip, keyframes: [...rest, keyframe].sort((a, b) => a.time - b.time) };
});
export const getTimelineEnd = clips => normalizeTimeline(clips).reduce((end, clip) => Math.max(end, clip.start + clip.duration), 0);
export const getClipAtTime = (clips, time, trackId) => normalizeTimeline(clips)
  .filter(clip => (!trackId || clip.trackId === trackId) && time >= clip.start && time < clip.start + clip.duration)
  .sort((a, b) => b.start - a.start)[0] || null;
export const mapTimelineToSourceTime = (clip, timelineTime) =>
  clip ? clip.sourceIn + clamp(finite(timelineTime) - clip.start, 0, clip.duration) * finite(clip.playbackRate, 1) : 0;
export const createProjectSnapshot = project => ({
  schemaVersion: PROJECT_SCHEMA_VERSION,
  ...project,
  timelineClips: normalizeTimeline(project.timelineClips || []),
  tracks: Array.isArray(project.tracks) ? project.tracks : TRACKS
});
export const migrateProject = project => {
  const value = project || {};
  const clips = Array.isArray(value.timelineClips) ? value.timelineClips :
    (Array.isArray(value.mediaFiles) ? value.mediaFiles.map((asset, index) => makeTimelineClip(asset, index * 0.05)) : []);
  return { ...value, schemaVersion: PROJECT_SCHEMA_VERSION, timelineClips: normalizeTimeline(clips), tracks: Array.isArray(value.tracks) ? value.tracks : TRACKS };
};
