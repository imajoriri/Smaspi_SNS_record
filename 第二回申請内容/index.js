"use strict";
const Alexa = require('alexa-sdk');
const http = require('http')
var rp = require('request-promise');


exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};
var handlers = {
  // 起動時に呼ばれるインテント
  'LaunchRequest': function () {
    var message = "スマートスピーカーの世界へようこそ。つぶやく内容をどうぞ。";
    this.emit(':ask', message);
  },
  // 「ヘルプ」と言われた時に呼ばれるインテント
  'AMAZON.HelpIntent': function () {
    var message = "スマートスピーカーの世界へようこそ。ここでは、スマートスピーカーを使って、ツイートを呟くことができます。";
    message = message + "呟いた内容は、専用のウェブサイトでみることができます。それでは呟く内容をどうぞ";
    this.emit(':ask', message);
  },
  // 投稿する時に呼ばれるインテント
  'TweetIntent': function () {
    var tweet = this.event.request.intent.slots.tweet.value;
    var message = tweet + 'ですね。投稿しました。';

    const url = 'secret';
    var options = {
      method: 'POST',
      url: url,
      form: {
        content: tweet
      },
      json: true
    };

    rp(options).then((response) => {
      console.log(response) //responseが内容
      this.emit(':tell', message);
    }, (error) => {
      this.emit(':tell', "もうしわけありません。ツイートに失敗しました。")
    });

  },
  'SessionEndedRequests': function () {
    //this.emit(':saveState', true); //第一回目の申請では、ここがだめだった
    this.emit(':tell', "投稿せずに終了します。")
  },
  'Amazon.StopIntent': function(){
    this.emit(':tell', "投稿せずに終了します。")
  },
  'Amazon.CancelIntent': function(){
    this.emit(':tell', "投稿せずに終了します。")
  },
  'Unhandled': function() {
    this.emit(':tell', "投稿せずに終了します。")
  }
};

