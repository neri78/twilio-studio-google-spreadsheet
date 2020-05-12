'use strict';
require('dotenv').config();
const { GoogleSpreadsheet } = require('google-spreadsheet');

// Googleスプレッドシートからシフト情報をロードし、担当者の電話番号を取得
async function loadShiftPhoneNumbers() {

    // スプレッドシートIDと資格情報を用いてGoogleスプレッドシートをロード
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
    const credentials = require('./credentials.json');
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();

    // 従業員情報を取得
    const staffSheet = await doc.sheetsById[process.env.STAFF_WORKSHEET_ID];
    const staffRows = await staffSheet.getRows();

    //シフト情報を取得
    const shiftSheet = await doc.sheetsById[process.env.SHIFT_WORKSHEET_ID];
    const shiftRows = await shiftSheet.getRows();

    // [ '5/8/2020', 'Daizen', 'Mitsuharu' ]
    // シフト情報からDate列の値と指定した日付をロケール情報に基づいて取得
    let shiftRow = shiftRows.find(row => 
            new Date(row.Date).toLocaleDateString() === new Date('2020/5/15').toLocaleDateString());

    // 元データ[ '5/15/2020', 'Mitsuharu', 'Yoshihiro' ]
    // Date列のみを取り除き、シフト担当の従業員を含む配列を取得する
    let employeesOnDuty = shiftRow._rawData.slice(1); // [ 'Mitsuharu', 'Yoshihiro' ]
    // 名前から電話番号の配列に置換
    employeesOnDuty = employeesOnDuty.map(
        m => staffRows.find(
            row => row.Name === m).PhoneNumber); // [ '+815012341235', '+815012341237' ]
    
    return employeesOnDuty.join(',');
}

loadShiftPhoneNumbers()
    .then ( numbers => {
        // twilio client
        const client = require('twilio')(
            process.env.TWILIO_ACCOUNTSID,
            process.env.TWILIO_AUTH_TOKEN);

        // Studioのフローを取得
        client.studio.flows(process.env.TWILIO_STUDIO_FLOW_SID)
            .fetch()
            .then(flow => {
                // フローの定義を取得
                let definition = flow.definition;
                // forward_callウィジェットを取得
                let callForwardWidget = definition.states.find(
                    item => item.name == 'forward_call');
                // 転送先番号をシフトの電話番号で更新
                callForwardWidget.properties.to = numbers;
                
                // 更新した定義を反映し、即座に公開
                client.studio.flows(process.env.TWILIO_STUDIO_FLOW_SID)
                    .update({
                        definition: definition,
                        commitMessage: 'シフトの更新 - 2020/05/15',
                        status: 'published'
                    })
                    .then(res => console.log(res))
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    })
    .catch( error => console.error(error));