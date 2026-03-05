module.exports.config = {
	name: "accbot",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "D-Jukie",
	description: "Xem thông tin account bot",
	commandCategory: "Admin",
	usages: "",
	cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    try {
        const info = await api.getUserInfo(api.getCurrentUserID());
        const botID = api.getCurrentUserID();
        const botInfo = info[botID];

        return api.sendMessage({
            body: `=== THÔNG TIN ACCOUNT BOT ===\n` +
                  `📛 Tên: ${botInfo.name}\n` +
                  `🆔 ID: ${botID}\n` +
                  `🔗 Profile: ${botInfo.profileUrl || `https://www.facebook.com/${botID}`}`,
        }, event.threadID, event.messageID);

    } catch (error) {
        return api.sendMessage("Không thể lấy thông tin bot!", event.threadID, event.messageID);
    }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const permission = global.config.NDH[0];
  if (!permission.includes(event.senderID))
    return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**You are not authorized to use this command!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, event.threadID, event.messageID);
  const botID = api.getCurrentUserID();
  const axios = require("axios");

  const { type, author } = handleReply;
  const { threadID, messageID, senderID } = event;
  let body = event.body || "";
  if (author != senderID) return;

  const args = body.split(" ");

  const reply = function (msg, callback) {
    if (callback) api.sendMessage(msg, threadID, callback, messageID);
    else api.sendMessage(msg, threadID, messageID);
  };

  if (type == 'menu') {
    if (["01", "1", "02", "2"].includes(args[0])) {
      reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please reply with the ${["01", "1"].includes(args[0]) ? "bio" : "nickname"} you want to set for the bot, or 'delete' to remove the current ${["01", "1"].includes(args[0]) ? "bio" : "nickname"}**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: ["01", "1"].includes(args[0]) ? "changeBio" : "changeNickname"
        });
      });
    }
    else if (["03", "3"].includes(args[0])) {
      const messagePending = await api.getThreadList(500, null, ["PENDING"]);
      const msg = messagePending.reduce((a, b) => a += `» ${b.name} | ${b.threadID} | Message: ${b.snippet}\n`, "") || "**No pending messages**";
      return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**List of bot's pending messages:**\n\n${msg}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
    }
    else if (["04", "4"].includes(args[0])) {
      const messagePending = await api.getThreadList(500, null, ["unread"]);
      const msg = messagePending.reduce((a, b) => a += `» ${b.name} | ${b.threadID} | Message: ${b.snippet}\n`, "") || "**No unread messages**";
      return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**List of bot's unread messages:**\n\n${msg}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
    }
    else if (["05", "5"].includes(args[0])) {
      const messagePending = await api.getThreadList(500, null, ["OTHER"]);
      const msg = messagePending.reduce((a, b) => a += `» ${b.name} | ${b.threadID} | Message: ${b.snippet}\n`, "") || "**No spam messages**";
      return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**List of bot's spam messages:**\n\n${msg}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
    }
    else if (["06", "6"].includes(args[0])) {
      reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please reply with an image or image link to set as the bot's avatar**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "changeAvatar"
        });
      });
    }
    else if (["07", "7"].includes(args[0])) {
      if (!args[1] || !["on", "off"].includes(args[1])) return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please choose 'on' or 'off'**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
      const form = {
        av: botID,
        variables: JSON.stringify({
          "0": {
            is_shielded: args[1] == 'on' ? true : false,
            actor_id: botID,
            client_mutation_id: Math.round(Math.random() * 19)
          }
        }),
        doc_id: "1477043292367183"
      };
      api.httpPost("https://www.facebook.com/api/graphql/", form, (err, data) => {
        if (err || JSON.parse(data).errors) reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**An error occurred, please try again later**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
        else reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully ${args[1] == 'on' ? 'enabled' : 'disabled'} the bot's avatar shield**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
      });
    }
    else if (["08", "8"].includes(args[0])) {
      return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please reply with the ID(s) of the user(s) you want to block, separated by spaces or new lines**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "blockUser"
        });
      });
    }
    else if (["09", "9"].includes(args[0])) {
      return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please reply with the ID(s) of the user(s) you want to unblock, separated by spaces or new lines**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "unBlockUser"
        });
      });
    }
    else if (["10"].includes(args[0])) {
      return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please reply with the content you want to create a post with**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "createPost"
        });
      });
    }
    else if (["11"].includes(args[0])) {
      return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please reply with the ID(s) of the post(s) you want to delete, separated by spaces or new lines**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "deletePost"
        });
      });
    }
    else if (["12", "13"].includes(args[0])) {
      return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please reply with the post ID(s) you want to comment on (${args[0] == "12" ? "user post" : "group post"}), separated by spaces or new lines**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "choiceIdCommentPost",
          isGroup: args[0] == "12" ? false : true
        });
      });
    }
    else if (["14", "15", "16", "17", "18", "19"].includes(args[0])) {
      return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please reply with the ID(s) of the post(s) or user(s) you want to ${args[0] == "14" ? "react to" : args[0] == "15" ? "send friend requests to" : args[0] == "16" ? "accept friend requests from" : args[0] == "17" ? "reject friend requests from" : args[0] == "18" ? "unfriend" : "send a message to"}, separated by spaces or new lines**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: args[0] == "14" ? "choiceIdReactionPost" : args[0] == "15" ? "addFiends" : args[0] == "16" ? "acceptFriendRequest" : args[0] == "17" ? "deleteFriendRequest" : args[0] == "18" ? "unFriends" : "choiceIdSendMessage"
        });
      });
    }
    else if (["20"].includes(args[0])) {
      reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please reply with the code you want to create a note with**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "noteCode",
          isGroup: args[0] == "12" ? false : true
        });
      });
    }
    else if (["21"].includes(args[0])) {
      api.logout((e) => {
        if (e) return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**An error occurred, please try again later**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
        else console.log('»» LOGOUT SUCCESS ««');
      });
    }
  }
  else if (type == 'changeBio') {
    const bio = body.toLowerCase() == 'delete' ? '' : body;
    api.changeBio(bio, false, (err) => {
      if (err) return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**An error occurred, please try again later**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
      else return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully ${!bio ? "deleted the bot's bio" : `changed the bot's bio to: ${bio}`}**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
    });
  }
  else if (type == 'changeNickname') {
    const nickname = body.toLowerCase() == 'delete' ? '' : body;
    let res = (await axios.get('https://mbasic.facebook.com/' + botID + '/about', {
      headers,
      params: {
        nocollections: "1",
        lst: `${botID}:${botID}:${Date.now().toString().slice(0, 10)}`,
        refid: "17"
      }
    })).data;
    require('fs-extra').writeFileSync(__dirname + "/cache/resNickname.html", res);

    let form;
    if (nickname) {
      const name_id = res.includes('href="/profile/edit/info/nicknames/?entid=') ? res.split('href="/profile/edit/info/nicknames/?entid=')[1].split("&amp;")[0] : null;

      const variables = {
        collectionToken: (new Buffer("app_collection:" + botID + ":2327158227:206")).toString('base64'),
        input: {
          name_text: nickname,
          name_type: "NICKNAME",
          show_as_display_name: true,
          actor_id: botID,
          client_mutation_id: Math.round(Math.random() * 19).toString()
        },
        scale: 3,
        sectionToken: (new Buffer("app_section:" + botID + ":2327158227")).toString('base64')
      };

      if (name_id) variables.input.name_id = name_id;

      form = {
        av: botID,
        fb_api_req_friendly_name: "ProfileCometNicknameSaveMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "4126222767480326",
        variables: JSON.stringify(variables)
      };
    }
    else {
      if (!res.includes('href="/profile/edit/info/nicknames/?entid=')) return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**The bot currently has no nickname set**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
      const name_id = res.split('href="/profile/edit/info/nicknames/?entid=')[1].split("&amp;")[0];
      form = {
        av: botID,
        fb_api_req_friendly_name: "ProfileCometAboutFieldItemDeleteMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "4596682787108894",
        variables: JSON.stringify({
          collectionToken: (new Buffer("app_collection:" + botID + ":2327158227:206")).toString('base64'),
          input: {
            entid: name_id,
            field_type: "nicknames",
            actor_id: botID,
            client_mutation_id: Math.round(Math.random() * 19).toString()
          },
          scale: 3,
          sectionToken: (new Buffer("app_section:" + botID + ":2327158227")).toString('base64'),
          isNicknameField: true,
          useDefaultActor: false
        })
      };
    }

    api.httpPost("https://www.facebook.com/api/graphql/", form, (e, i) => {
      if (e) return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**An error occurred, please try again later**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
      else if (JSON.parse(i).errors) reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**An error occurred: ${JSON.parse(i).errors[0].summary}, ${JSON.parse(i).errors[0].description}**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
      else reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully ${!nickname ? "deleted the bot's nickname" : `changed the bot's nickname to: ${nickname}`}**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
    });
  }
  else if (type == 'changeAvatar') {
    let imgUrl;
    if (body && body.match(/^((http(s?)?):\/\/)?([wW]{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/g)) imgUrl = body;
    else if (event.attachments[0] && event.attachments[0].type == "photo") imgUrl = event.attachments[0].url;
    else return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please provide a valid image link or reply with an image to set as the bot's avatar**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "changeAvatar"
      });
    });
    try {
      const imgBuffer = (await axios.get(imgUrl, {
        responseType: "stream"
      })).data;
      const form0 = {
        file: imgBuffer
      };
      let uploadImageToFb = await api.httpPostFormData(`https://www.facebook.com/profile/picture/upload/?profile_id=${botID}&photo_source=57&av=${botID}`, form0);
      uploadImageToFb = JSON.parse(uploadImageToFb.split("for (;;);")[1]);
      if (uploadImageToFb.error) return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**An error occurred: ${uploadImageToFb.error.errorDescription}**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
      const idPhoto = uploadImageToFb.payload.fbid;
      const form = {
        av: botID,
        fb_api_req_friendly_name: "ProfileCometProfilePictureSetMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "5066134240065849",
        variables: JSON.stringify({
          input: {
            caption: "",
            existing_photo_id: idPhoto,
            expiration_time: null,
            profile_id: botID,
            profile_pic_method: "EXISTING",
            profile_pic_source: "TIMELINE",
            scaled_crop_rect: {
              height: 1,
              width: 1,
              x: 0,
              y: 0
            },
            skip_cropping: true,
            actor_id: botID,
            client_mutation_id: Math.round(Math.random() * 19).toString()
          },
          isPage: false,
          isProfile: true,
          scale: 3
        })
      };
      api.httpPost("https://www.facebook.com/api/graphql/", form, (e, i) => {
        if (e) reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**An error occurred, please try again later**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
        else if (JSON.parse(i.slice(0, i.indexOf('\n') + 1)).errors) reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**An error occurred: ${JSON.parse(i).errors[0].description}**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
        else reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully changed the bot's avatar, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
      });
    }
    catch (err) {
      reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**An error occurred, please try again later**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
    }
  }
  else if (type == 'blockUser') {
    if (!body) return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please provide the UID(s) of the user(s) you want to block on Messenger, separated by spaces or new lines**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: 'blockUser'
      });
    });
    const uids = body.replace(/\s+/g, " ").split(" ");
    const success = [];
    const failed = [];
    for (const uid of uids) {
      try {
        await api.changeBlockedStatus(uid, true);
        success.push(uid);
      }
      catch (err) {
        failed.push(uid);
      }
    }
    reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully blocked ${success.length} user(s) on Messenger${failed.length > 0 ? `\nFailed to block ${failed.length} user(s), IDs: ${failed.join(" ")}` : ""}**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
  }
  else if (type == 'unBlockUser') {
    if (!body) return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please provide the UID(s) of the user(s) you want to unblock on Messenger, separated by spaces or new lines**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: 'unBlockUser'
      });
    });
    const uids = body.replace(/\s+/g, " ").split(" ");
    const success = [];
    const failed = [];
    for (const uid of uids) {
      try {
        await api.changeBlockedStatus(uid, false);
        success.push(uid);
      }
      catch (err) {
        failed.push(uid);
      }
    }
    reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully unblocked ${success.length} user(s) on Messenger${failed.length > 0 ? `\nFailed to unblock ${failed.length} user(s), IDs: ${failed.join(" ")}` : ""}**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
  }
  else if (type == 'createPost') {
    if (!body) return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please provide the content for the post**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: 'createPost'
      });
    });

    const session_id = getGUID();
    const form = {
      av: botID,
      fb_api_req_friendly_name: "ComposerStoryCreateMutation",
      fb_api_caller_class: "RelayModern",
      doc_id: "4612917415497545",
      variables: JSON.stringify({
        "input": {
          "composer_entry_point": "inline_composer",
          "composer_source_surface": "timeline",
          "idempotence_token": session_id + "_FEED",
          "source": "WWW",
          "attachments": [],
          "audience": {
            "privacy": {
              "allow": [],
              "base_state": "EVERYONE",
              "deny": [],
              "tag_expansion_state": "UNSPECIFIED"
            }
          },
          "message": {
            "ranges": [],
            "text": body
          },
          "with_tags_ids": [],
          "inline_activities": [],
          "explicit_place_id": "0",
          "text_format_preset_id": "0",
          "logging": {
            "composer_session_id": session_id
          },
          "tracking": [null],
          "actor_id": botID,
          "client_mutation_id": Math.round(Math.random() * 19)
        },
        "displayCommentsFeedbackContext": null,
        "displayCommentsContextIsAdPreview": null,
        "displayCommentsContextIsAggregatedShare": null,
        "displayCommentsContextIsStorySet": null,
        "feedLocation": "TIMELINE",
        "feedbackSource": 0,
        "focusCommentID": null,
        "gridMediaWidth": 230,
        "scale": 3,
        "privacySelectorRenderLocation": "COMET_STREAM",
        "renderLocation": "timeline",
        "useDefaultActor": false,
        "inviteShortLinkKey": null,
        "isFeed": false,
        "isFundraiser": false,
        "isFunFactPost": false,
        "isGroup": false,
        "isTimeline": true,
        "isSocialLearning": false,
        "isPageNewsFeed": false,
        "isProfileReviews": false,
        "isWorkSharedDraft": false,
        "UFI2CommentsProvider_commentsKey": "ProfileCometTimelineRoute",
        "useCometPhotoViewerPlaceholderFrag": true,
        "hashtag": null,
        "canUserManageOffers": false
      })
    };

    api.httpPost('https://www.facebook.com/api/graphql/', form, (e, i) => {
      if (e || JSON.parse(i).errors) return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Failed to create post, please try again later**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
      const postID = JSON.parse(i).data.story_create.story.legacy_story_hideable_id;
      const urlPost = JSON.parse(i).data.story_create.story.url;
      return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully created post, Kashif Raza!**\n» Post ID: ${postID}\n» Post URL: ${urlPost}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
    });
  }
  else if (type == 'choiceIdCommentPost') {
    if (!body) return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please provide the ID(s) of the post(s) you want to comment on**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "choiceIdCommentPost",
        isGroup: handleReply.isGroup
      });
    });
    reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please reply with the content you want to comment on the post(s)**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        postIDs: body.replace(/\s+/g, " ").split(" "),
        type: "commentPost",
        isGroup: handleReply.isGroup
      });
    });
  }
  else if (type == 'commentPost') {
    const { postIDs, isGroup } = handleReply;

    if (!body) return reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please provide the content you want to comment on the post(s)**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "commentPost",
        postIDs: handleReply.postIDs,
        isGroup: handleReply.isGroup
      });
    });
    const success = [];
    const failed = [];

    for (let id of postIDs) {
      const postID = (new Buffer('feedback:' + id)).toString('base64');
      const { isGroup } = handleReply;
      const ss1 = getGUID();
      const ss2 = getGUID();

      const form = {
        av: botID,
        fb_api_req_friendly_name: "CometUFICreateCommentMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "4744517358977326",
        variables: JSON.stringify({
          "displayCommentsFeedbackContext": null,
          "displayCommentsContextEnableComment": null,
          "displayCommentsContextIsAdPreview": null,
          "displayCommentsContextIsAggregatedShare": null,
          "displayCommentsContextIsStorySet": null,
          "feedLocation": "TIMELINE",
          "feedbackSource": 0,
          "focusCommentID": null,
          "gridMediaWidth": 230,
          "scale": 3,
          "privacySelectorRenderLocation": "COMET_STREAM",
          "renderLocation": "timeline",
          "useDefaultActor": false,
          "inviteShortLinkKey": null,
          "isFeed": false,
          "isFundraiser": false,
          "isFunFactPost": false,
          "isGroup": isGroup,
          "isTimeline": true,
          "isSocialLearning": false,
          "isPageNewsFeed": false,
          "isProfileReviews": false,
          "isWorkSharedDraft": false,
          "UFI2CommentsProvider_commentsKey": "ProfileCometTimelineRoute",
          "useCometPhotoViewerPlaceholderFrag": true,
          "hashtag": null,
          "canUserManageOffers": false,
          "commentText": body,
          "id": postID,
          "actor_id": botID,
          "client_mutation_id": Math.round(Math.random() * 19)
        })
      };

      api.httpPost('https://www.facebook.com/api/graphql/', form, (e, i) => {
        if (e || JSON.parse(i).errors) failed.push(id);
        else success.push(id);
      });
    }

    reply(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully commented on ${success.length} post(s)${failed.length > 0 ? `\nFailed to comment on ${failed.length} post(s), IDs: ${failed.join(" ")}` : ""}**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`);
  }
};