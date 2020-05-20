# Google Shees API + Twilio Studio REST API v2サンプル

このプロジェクトは下記の2記事の動作を確認いただけるサンプルです。  　
- [GoogleスプレッドシートからNode.jsでシフトデータを読み出す方法](https://www.twilio.com/blog/load-data-from-google-spreadsheet-jp)
- [Googleスプレッドシートのシフト表を使ってTwilio Studioフローの転送先をNode.jsから更新する方法](https://www.twilio.com/blog/google-twilio-studio-rest-api-node-jp)

## 前提条件

- Twilioアカウントを持っていること（[無料トライアルのサインアップ方法](https://www.twilio.com/blog/how-to-create-twilio-account-jp)）
- 期間限定の問い合わせ番号となる電話番号を購入していること
（[日本の番号を取得する場合](https://support.twilio.com/hc/en-us/articles/360044400214-%E8%A6%8F%E5%88%B6%E6%83%85%E5%A0%B1%E3%81%AB%E9%96%A2%E3%82%8F%E3%82%8B%E6%9B%B8%E9%A1%9E%E3%81%AE%E6%8F%90%E5%87%BA%E6%96%B9%E6%B3%95)）
- [こちらの記事](https://www.twilio.com/blog/call-forwarding-studio-remote-work)に則りフローを作成、公開済みであること

## 1. Googleスプレッドシートの取得とGCPの設定

[こちらの記事](https://www.twilio.com/blog/load-data-from-google-spreadsheet-jp)の次のセクションを説明に沿って実施してください。
- シフトを管理するGoogleスプレッドシート
- GCPでSheets APIを有効化
- Googleスプレッドシートの共有とURLや情報の確認（スプレッドシートのIDやシートのIDを控えておきます）

## 2. 必要パッケージのインストール
リポジトリをクローンし、パッケージをインストールしてください。
```bash
npm install
```

## 3. 環境変数の設定
`.env.sample`ファイルをコピーし、`.env`と名前を変更します。
このファイルには、次の変数が定義されています。
```bash
SPREADSHEET_ID=
SHIFT_WORKSHEET_ID=
STAFF_WORKSHEET_ID=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_STUDIO_FLOW_SID=
```
先ほど控えておいたスプレッドシートのIDを`SPREADSHEET_ID`に、ShiftシートのIDを、`SHIFT_WORKSHEET_ID`に、StaffシートのIDを`STAFF_WORKSHEET_ID`にそれぞれ値として入力します。

[Twilioコンソール](https://www.twilio.com/console)からAccount SidとAuth Tokenをコピーし、それぞれ`TWILIO_ACCOUNT_SID`と`TWILIO_AUTH_TOKEN`に入力します。

[Studioコンソール](https://www.twilio.com/console/studio/dashboard)を開き、call forwardingフローのSIDを`TWILIO_STUDIO_FLOW_SID`の値として設定します。

## 実行
下記のコマンド実行し、Twilio Studioフローの転送先電話番号が更新されていることを確認します。

```bash
node index.js
```

不明点があればぜひ、お問い合わせください。  
Twitter (@Neri78)  
Email: dikehara@twilio.com  
Twitch: https://twitch.tv/neri78