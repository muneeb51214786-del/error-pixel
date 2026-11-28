package com.erroreditx.videoengine

import android.net.Uri
import androidx.media3.common.MediaItem
import androidx.media3.effect.Presentation
import androidx.media3.transformer.EditedMediaItem
import androidx.media3.transformer.Effects
import androidx.media3.transformer.ExportException
import androidx.media3.transformer.ExportResult
import androidx.media3.transformer.Transformer
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlinx.coroutines.suspendCancellableCoroutine

class EnhanceErrorVideoEngineModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("EnhanceErrorVideoEngine")

    AsyncFunction("exportVideo") { inputUri: String, width: Int, height: Int ->
      require(width in 144..3840 && height in 144..3840) {
        "Output dimensions must be between 144 and 3840 pixels."
      }
      val context = appContext.reactContext ?: error("Android context is unavailable.")
      val output = File(context.cacheDir, "enhance-error-${System.currentTimeMillis()}.mp4")
      suspendCancellableCoroutine<Map<String, Any?>> { continuation ->
        val transformer = Transformer.Builder(context)
          .addListener(object : Transformer.Listener {
            override fun onCompleted(composition: androidx.media3.transformer.Composition, exportResult: ExportResult) {
              if (continuation.isActive) {
                continuation.resume(mapOf(
                  "uri" to output.absolutePath,
                  "width" to width,
                  "height" to height,
                  "message" to "Video exported using Android Media3."
                ))
              }
            }

            override fun onError(
              composition: androidx.media3.transformer.Composition,
              exportResult: ExportResult,
              exportException: ExportException
            ) {
              if (continuation.isActive) continuation.resumeWithException(exportException)
            }
          })
          .build()

        continuation.invokeOnCancellation { transformer.cancel() }
        try {
          val item = EditedMediaItem.Builder(MediaItem.fromUri(Uri.parse(inputUri)))
            .setEffects(Effects(emptyList(), listOf(
              Presentation.createForWidthAndHeight(width, height, Presentation.LAYOUT_SCALE_TO_FIT)
            )))
            .build()
          transformer.start(item, output.absolutePath)
        } catch (error: Throwable) {
          if (continuation.isActive) continuation.resumeWithException(error)
        }
      }
    }
  }
}