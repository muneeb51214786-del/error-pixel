// ERROR PIXEL non-destructive timeline model
export const makeTimelineClip = (asset, start = 0) => {
  const seconds = Math.max(0, Number(asset.duration || 0) / 1000);
  const fallback = asset.type === 'image' ? 5 : asset.type === 'audio' ? 30 : 15;
  const duration = seconds || fallback;
  return {
    id: 'clip-' + asset.id, assetId: asset.id,
    trackId: asset.type === 'video' ? 'video-1' : asset.type === 'audio' ? 'audio-1' : 'overlay-1',
    type: asset.type, name: asset.name || 'Untitled media', uri: asset.uri,
    start, sourceIn: 0, sourceOut: duration, duration,
    effects: [], keyframes: [], transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 }
  };
};
export const splitTimelineClip = (clips, clipId, atTime) => {
  const clip = clips.find(item => item.id === clipId);
  if (!clip) return clips;
  const local = atTime - clip.start;
  if (local <= 0.05 || local >= clip.duration - 0.05) return clips;
  const left = { ...clip, duration: local, sourceOut: clip.sourceIn + local };
  const right = {
    ...clip, id: clip.id + '-split-' + Math.round(atTime * 1000),
    start: atTime, sourceIn: clip.sourceIn + local,
    duration: clip.duration - local, sourceOut: clip.sourceOut
  };
  return clips.flatMap(item => item.id === clipId ? [left, right] : [item]);
};
export const getTimelineEnd = clips => clips.reduce((end, clip) => Math.max(end, clip.start + clip.duration), 0);
