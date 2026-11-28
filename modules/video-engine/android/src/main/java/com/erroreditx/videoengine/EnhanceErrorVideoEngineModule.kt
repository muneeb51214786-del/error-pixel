package com.erroreditx.videoengine

import android.content.ContentValues
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.os.Handler
import android.os.Looper
import android.provider.MediaStore
import androidx.media3.common.MediaItem
import androidx.media3.effect.Presentation
import androidx.media3.transformer.EditedMediaItem
import androidx.media3.transformer.Effects
import androidx.media3.transformer.ExportException
import androidx.media3.transformer.ExportResult
import androidx.media3.transformer.ProgressHolder
import androidx.media3.transformer.Transformer
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File
import java.io.FileInputStream
import java.util.concurrent.TimeUnit
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okio.BufferedSink
import okio.source

class EnhanceErrorVideoEngineModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("EnhanceErrorVideoEngine")
    Events("onExportProgress")

    AsyncFunction("exportVideo") { inputUri: String, width: Int, height: Int, startMs: Long, endMs: Long, promise: Promise ->
      var galleryUri: Uri? = null
      try {
        require(width in 144..3840 && height in 144..3840) {
          "Output dimensions must be between 144 and 3840 pixels."
        }
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
          error("Gallery export currently requires Android 10 or newer.")
        }
        val context = appContext.reactContext ?: error("Android context is unavailable.")
        val output = File(context.cacheDir, "enhance-error-${System.currentTimeMillis()}.mp4")
        var finished = false
        val transformer = Transformer.Builder(context)
          .addListener(object : Transformer.Listener {
            override fun onCompleted(composition: androidx.media3.transformer.Composition, exportResult: ExportResult) {
              if (!output.exists() || output.length() <= 0L) {
                finished = true
                promise.reject("VIDEO_EXPORT_EMPTY", "The encoder completed but produced an empty output file.", null)
                return
              }
              try {
                sendEvent("onExportProgress", mapOf("progress" to 0.96f, "stage" to "Saving video to Gallery"))
                val values = ContentValues().apply {
                  put(MediaStore.Video.Media.DISPLAY_NAME, "EnhanceError_${System.currentTimeMillis()}.mp4")
                  put(MediaStore.Video.Media.MIME_TYPE, "video/mp4")
                  put(MediaStore.Video.Media.RELATIVE_PATH, Environment.DIRECTORY_MOVIES + "/Enhance Error")
                  put(MediaStore.Video.Media.IS_PENDING, 1)
                }
                val resolver = context.contentResolver
                val collection = MediaStore.Video.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
                galleryUri = resolver.insert(collection, values)
                  ?: error("Android could not create a Gallery media entry.")
                val destination = resolver.openOutputStream(galleryUri!!, "w")
                  ?: error("Android could not open the Gallery video file.")
                destination.use { out -> FileInputStream(output).use { input -> input.copyTo(out) } }
                val publish = ContentValues().apply { put(MediaStore.Video.Media.IS_PENDING, 0) }
                if (resolver.update(galleryUri!!, publish, null, null) <= 0) {
                  error("The video was copied, but Android could not publish it to Gallery.")
                }
                val savedUri = galleryUri!!.toString()
                finished = true
                sendEvent("onExportProgress", mapOf("progress" to 1f, "stage" to "Saved to Gallery"))
                promise.resolve(mapOf(
                  "uri" to savedUri,
                  "galleryUri" to savedUri,
                  "width" to width,
                  "height" to height,
                  "message" to "Video exported and saved to Movies/Enhance Error."
                ))
                output.delete()
              } catch (saveError: Throwable) {
                galleryUri?.let { try { context.contentResolver.delete(it, null, null) } catch (_: Throwable) {} }
                finished = true
                promise.reject("GALLERY_SAVE_FAILED", saveError.message ?: "Video was encoded but could not be saved to Gallery.", saveError)
              }
            }

            override fun onError(
              composition: androidx.media3.transformer.Composition,
              exportResult: ExportResult,
              exportException: ExportException
            ) {
              finished = true
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
        sendEvent("onExportProgress", mapOf("progress" to 0.01f, "stage" to "Preparing video"))
        transformer.start(item, output.absolutePath)
        val progressHandler = Handler(Looper.getMainLooper())
        val progressHolder = ProgressHolder()
        val progressPoll = object : Runnable {
          override fun run() {
            if (finished) return
            try {
              val state = transformer.getProgress(progressHolder)
              if (state == Transformer.PROGRESS_STATE_AVAILABLE) {
                val encodeProgress = progressHolder.progress.coerceIn(0, 100) / 100f
                sendEvent("onExportProgress", mapOf(
                  "progress" to (encodeProgress * 0.94f).coerceIn(0.02f, 0.94f),
                  "stage" to if (encodeProgress < 0.03f) "Preparing video" else "Encoding MP4 video"
                ))
              } else {
                sendEvent("onExportProgress", mapOf("progress" to 0.01f, "stage" to "Preparing video"))
              }
              if (!finished) progressHandler.postDelayed(this, if (state == Transformer.PROGRESS_STATE_UNAVAILABLE) 500 else 250)
            } catch (_: Throwable) {
              if (!finished) progressHandler.postDelayed(this, 500)
            }
          }
        }
        progressHandler.post(progressPoll)
      } catch (error: Throwable) {
        galleryUri?.let { try { appContext.reactContext?.contentResolver?.delete(it, null, null) } catch (_: Throwable) {} }
        promise.reject("VIDEO_EXPORT_FAILED", error.message ?: "Video export failed.", error)
      }
    }

    AsyncFunction("interpolateRifeVideo") { inputUri: String, functionUrl: String, anonKey: String, accessToken: String, promise: Promise ->
      Thread {
        var savedUri: Uri? = null
        try {
          require(functionUrl.startsWith("https://")) { "RIFE gateway must use HTTPS." }
          require(anonKey.isNotBlank() && accessToken.isNotBlank()) { "A Supabase sign-in session is required." }
          val context = appContext.reactContext ?: error("Android context is unavailable.")
          val sourceUri = Uri.parse(inputUri)
          val resolver = context.contentResolver
          val fileName = "EnhanceError_Source.mp4"
          val requestBody = object : RequestBody() {
            override fun contentType() = "application/octet-stream".toMediaType()
            override fun writeTo(sink: BufferedSink) {
              val stream = resolver.openInputStream(sourceUri) ?: error("Cannot open selected source video.")
              stream.source().use { sink.writeAll(it) }
            }
          }
          val multipart = MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("file", fileName, requestBody)
            .build()
          val request = Request.Builder()
            .url(functionUrl)
            .header("apikey", anonKey)
            .header("Authorization", "Bearer $accessToken")
            .post(multipart)
            .build()
          val client = OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(3, TimeUnit.MINUTES)
            .readTimeout(13, TimeUnit.MINUTES)
            .callTimeout(14, TimeUnit.MINUTES)
            .build()

          sendEvent("onExportProgress", mapOf("progress" to 0.03f, "stage" to "Uploading video to RIFE GPU"))
          client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) {
              val detail = response.body?.string()?.take(1800) ?: "RIFE service returned HTTP ${response.code}."
              error(detail)
            }
            val body = response.body ?: error("RIFE service returned an empty response.")
            val mime = body.contentType()?.toString() ?: ""
            require(mime.startsWith("video/mp4")) { "RIFE service did not return an MP4 video." }
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
              error("Gallery export currently requires Android 10 or newer.")
            }
            sendEvent("onExportProgress", mapOf("progress" to 0.82f, "stage" to "Saving RIFE output to Gallery"))
            val values = ContentValues().apply {
              put(MediaStore.Video.Media.DISPLAY_NAME, "EnhanceError_RIFE_${System.currentTimeMillis()}.mp4")
              put(MediaStore.Video.Media.MIME_TYPE, "video/mp4")
              put(MediaStore.Video.Media.RELATIVE_PATH, Environment.DIRECTORY_MOVIES + "/Enhance Error")
              put(MediaStore.Video.Media.IS_PENDING, 1)
            }
            val collection = MediaStore.Video.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
            savedUri = resolver.insert(collection, values) ?: error("Android could not create a Gallery media entry.")
            val destination = resolver.openOutputStream(savedUri!!, "w")
              ?: error("Android could not open the Gallery output file.")
            destination.use { out -> body.byteStream().use { it.copyTo(out) } }
            val publish = ContentValues().apply { put(MediaStore.Video.Media.IS_PENDING, 0) }
            if (resolver.update(savedUri!!, publish, null, null) <= 0) {
              error("The RIFE video was copied but could not be published to Gallery.")
            }
            val finalUri = savedUri!!.toString()
            val outputFps = response.header("X-Output-FPS")?.toDoubleOrNull() ?: 0.0
            val sourceFps = response.header("X-Source-FPS")?.toDoubleOrNull() ?: 0.0
            sendEvent("onExportProgress", mapOf("progress" to 1f, "stage" to "RIFE video saved to Gallery"))
            promise.resolve(mapOf(
              "uri" to finalUri,
              "galleryUri" to finalUri,
              "engine" to "RIFE",
              "fpsMultiplier" to 2,
              "outputFps" to outputFps,
              "sourceFps" to sourceFps,
              "message" to "RIFE 2x video saved to Movies/Enhance Error."
            ))
          }
        } catch (error: Throwable) {
          savedUri?.let { try { appContext.reactContext?.contentResolver?.delete(it, null, null) } catch (_: Throwable) {} }
          promise.reject("RIFE_VIDEO_FAILED", error.message ?: "RIFE video processing failed.", error)
        }
      }.start()
    }
  }
}