const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: 'upload',
    commandCategory: 'Utility',
    hasPermssion: 0,
    credits: '𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀',
    usages: 'Upload any media file to qu.ax or catbox',
    description: 'Upload images, videos, audio, GIFs to qu.ax or catbox with expiry dates',
    cooldowns: 5
  },
  run: async ({ api, event }) => {
    const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);

    // Check if replying to a message with attachments
    if (event.type !== "message_reply") {
      return send("⚠️ Please reply to a message containing media files (image, video, audio, or GIF)");
    }

    const attachments = event.messageReply.attachments;

    if (!attachments || attachments.length === 0) {
      return send("⚠️ No attachments found in the replied message");
    }

    send(`📤 Uploading ${attachments.length} file(s)... Please wait.`);

    const uploadResults = [];

    for (let i = 0; i < attachments.length; i++) {
      const attachment = attachments[i];

      try {
        // Download the file
        const fileResponse = await axios.get(attachment.url, {
          responseType: 'arraybuffer',
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          timeout: 60000
        });

        // Determine file details
        let fileExt = 'bin';
        let mimeType = 'application/octet-stream';

        switch (attachment.type) {
          case 'video':
            fileExt = 'mp4';
            mimeType = 'video/mp4';
            break;
          case 'audio':
            fileExt = 'mp3';
            mimeType = 'audio/mpeg';
            break;
          case 'animated_image':
            fileExt = 'gif';
            mimeType = 'image/gif';
            break;
          case 'photo':
            const contentType = fileResponse.headers['content-type'];
            if (contentType?.includes('png')) {
              fileExt = 'png';
              mimeType = 'image/png';
            } else if (contentType?.includes('webp')) {
              fileExt = 'webp';
              mimeType = 'image/webp';
            } else {
              fileExt = 'jpg';
              mimeType = 'image/jpeg';
            }
            break;
        }

        // Upload to qu.ax
        const formDataQuax = new FormData();
        formDataQuax.append('file', Buffer.from(fileResponse.data), {
          filename: `file_${Date.now()}_${i}.${fileExt}`,
          contentType: mimeType
        });
        formDataQuax.append('apikey', 'freeApikey');

        const uploadResponseQuax = await axios.post(
          'https://anabot.my.id/api/tools/quAx',
          formDataQuax,
          {
            headers: {
              'Accept': 'application/json',
              ...formDataQuax.getHeaders()
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 120000
          }
        );

        let quaxResult = null;
        if (uploadResponseQuax.data?.success && uploadResponseQuax.data?.data?.result) {
          const result = uploadResponseQuax.data.data.result;
          quaxResult = {
            success: true,
            type: attachment.type,
            url: result.url,
            size: result.size,
            expiry: result.expiry,
            name: result.name
          };
        } else {
          quaxResult = {
            success: false,
            type: attachment.type,
            error: uploadResponseQuax.data?.error || 'Unknown error'
          };
        }

        // Upload to catbox.moe as an alternative
        const formDataCatbox = new FormData();
        formDataCatbox.append('reqtype', 'fileupload');
        formDataCatbox.append('fileToUpload', Buffer.from(fileResponse.data), {
          filename: `file_${Date.now()}_${i}.${fileExt}`,
          contentType: mimeType
        });

        const uploadResponseCatbox = await axios.post(
          'https://catbox.moe/user/api.php',
          formDataCatbox,
          {
            headers: {
              ...formDataCatbox.getHeaders()
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 120000
          }
        );

        let catboxResult = null;
        if (uploadResponseCatbox.data && typeof uploadResponseCatbox.data === 'string' && uploadResponseCatbox.data.startsWith('https://catbox.moe/files/')) {
          catboxResult = {
            success: true,
            type: attachment.type,
            url: uploadResponseCatbox.data
          };
        } else {
          catboxResult = {
            success: false,
            type: attachment.type,
            error: uploadResponseCatbox.data || 'Unknown error'
          };
        }

        uploadResults.push({
          quax: quaxResult,
          catbox: catboxResult
        });

      } catch (error) {
        uploadResults.push({
          quax: { success: false, type: attachment.type, error: error.response?.data?.error || error.message },
          catbox: { success: false, type: attachment.type, error: error.response?.data?.error || error.message }
        });
      }
    }

    // Format response message
    let message = `📊 Upload Results (${uploadResults.length} file(s)):\n\n`;

    uploadResults.forEach((result, index) => {
      message += `--- File ${index + 1} ---\n\n`;

      // Qu.ax Results
      message += `[qu.ax]\n`;
      if (result.quax.success) {
        message += `✅ Status: Success\n`;
        message += `   🔗 URL: ${result.quax.url}\n`;
        message += `   📦 Size: ${(result.quax.size / 1024).toFixed(2)} KB\n`;
        message += `   ⏰ Expires: ${result.quax.expiry}\n\n`;
      } else {
        message += `❌ Status: Failed\n`;
        message += `   Error: ${result.quax.error}\n\n`;
      }

      // Catbox Results
      message += `[Catbox]\n`;
      if (result.catbox.success) {
        message += `✅ Status: Success\n`;
        message += `   🔗 URL: ${result.catbox.url}\n`;
      } else {
        message += `❌ Status: Failed\n`;
        message += `   Error: ${result.catbox.error}\n`;
      }
      message += `\n`;
    });

    return send(message.trim());
  }
};