package com.erroreditx.videoengine

import android.net.Uri
import androidx.media3.common.MediaItem
import androidx.media3.effect.Presentation
import androidx.media3.transformer.EditedMediaItem
import androidx.media3.transformer.Effects
import androidx.media3.transformer.ExportException
import androidx.media3.transformer.ExportResult
import androidx.media3.transformer.Transformer
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File

class EnhanceErrorVideoEngineModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("EnhanceErrorVideoEngine")
    Events("onExportProgress")

    AsyncFunction("exportVideo") { inputUri: String, width: Int, height: Int, startMs: Long, endMs: Long, promise: Promise ->
      try {
        require(width in 144..3840 && height in 144..3840) {
          "Output dimensions must be between 144 and 3840 pixels."
        }
        val context = appContext.reactContext ?: error("Android context is unavailable.")
        val output = File(context.cacheDir, "enhance-error-${System.currentTimeMillis()}.mp4")
        val transformer = Transformer.Builder(context)
          .addListener(object : Transformer.Listener {
            override fun onProgress(composition: androidx.media3.transformer.Composition, progress: Float) {
              if (progress >= 0f) sendEvent("onExportProgress", mapOf("progress" to progress.coerceIn(0f, 1f), "stage" to "Exporting video"))
            }

            override fun onCompleted(composition: androidx.media3.transformer.Composition, exportResult: ExportResult) {
              sendEvent("onExportProgress", mapOf("progress" to 1f, "stage" to "Export complete"))
              promise.resolve(mapOf(
                "uri" to output.absolutePath,
                "width" to width,
                "height" to height,
                "message" to "Video exported using Android Media3."
              ))
            }

            override fun onError(
              composition: androidx.media3.transformer.Composition,
              exportResult: ExportResult,
              exportException: ExportException
            ) {
              promise.reject("VIDEO_EXPORT_FAILED", exportException.message ?: "Video export failed.", exportException)
            }
          })
          .build()

        val mediaBuilder = MediaItem.Builder().setUri(Uri.parse(inputUri))
        if (endMs > startMs && startMs >= 0L) {
          mediaBuilder.setClippingConfiguration(
            MediaItem.ClippingConfiguration.Builder()
              .setStartPositionMs(startMs)
              .setEndPositionMs(endMs)
              .build()
          )
        }
        val item = EditedMediaItem.Builder(mediaBuilder.build())
          .setEffects(Effects(emptyList(), listOf(
            Presentation.createForWidthAndHeight(width, height, Presentation.LAYOUT_SCALE_TO_FIT)
          )))
          .build()
        transformer.start(item, output.absolutePath)
      } catch (error: Throwable) {
        promise.reject("VIDEO_EXPORT_FAILED", error.message ?: "Video export failed.", error)
      }
    }
  }
}