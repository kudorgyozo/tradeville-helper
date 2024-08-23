// ==UserScript==
// @name         TradeVille Bond Calc
// @namespace    http://tampermonkey.net/
// @version      2024-08-20-2
// @description  Calculate bond interest rate!
// @author       Gyozo Kudor
// @match        https://portal.tradeville.ro/portal/trading.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tradeville.ro
// @require      file://E:\projects\tradeville-helper\dist\assets\index.js
// @require      file://E:\projects\tradeville-helper\dist\assets\index.js.map
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/504077/TradeVille%20Bond%20Calc.user.js
// @updateURL https://update.greasyfork.org/scripts/504077/TradeVille%20Bond%20Calc.meta.js
// ==/UserScript==

import { debounce } from 'lodash';
import { dateDiffDays, dateDiffYears, getTodaysDate, parseCustomDateString, } from './dateUtils';

(function () {
    'use strict'
    console.log('megyezaszar');

    function setOutput(interest1Y, interestYMT, totalEarned) {
        const interest1YFmt = `${(interest1Y * 100).toFixed(2)} %`;
        const interestYMTFmt = `${(interestYMT * 100).toFixed(2)} %`;

        const interest1YId = 'interest1Y';
        const interestYMTId = 'interestYMT';
        const totalEarnedId = 'totalEarned';
        if ($(`.ordinprev table tr#${interest1YId}`).length == 0) {
            let newRow = `<tr id='${interest1YId}'> <td>interest1Y</td> <td></td> </tr>`;
            $('.ordinprev table').append(newRow);
        }

        if ($(`.ordinprev table tr#${interestYMTId}`).length == 0) {
            let newRow = `<tr id='${interestYMTId}'> <td>interestYMT</td> <td></td> </tr>`;
            $('.ordinprev table').append(newRow);
        }

        if ($(`.ordinprev table tr#${totalEarnedId}`).length == 0) {
            let newRow = `<tr id='${totalEarnedId}'> <td>Total earned</td> <td></td> </tr>`;
            $('.ordinprev table').append(newRow);
        }

        $(`.ordinprev table tr#${interest1YId} td:nth-child(2)`).text(interest1YFmt);
        $(`.ordinprev table tr#${interestYMTId} td:nth-child(2)`).text(interestYMTFmt);
        $(`.ordinprev table tr#${totalEarnedId} td:nth-child(2)`).text(totalEarned.toFixed(2));
    }

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    $(async function () {
        await delay(1000);

        $(document.body).on('keyup mouseup', '#NewOrderSection form[comanda=ordinnou].centru', debounce(() => {
            const bondTitle = $('.TitluSiSimbol span[gi=nume]').text();
            if (!bondTitle.startsWith('Titluri de stat')) return;

            if ($('#containerInformatii span[gi=randcup].denomPrc, #containerInformatii span[gi=valnom]').length < 2) {
                $('#butonDetaliiSimbolPortalO').click();
                return;
            }

            try {
                //get bond information from UI
                const bondPrice = Number.parseInt($('#containerInformatii span[gi=valnom]')[0].innerText);
                const bondinterestRate = Number.parseFloat($('#containerInformatii span[gi=randcup].denomPrc')[0].innerText) / 100;
                const maturityDate = parseCustomDateString($('#containerInformatii #detaliiTsimOblig span[gi=datafin]')[0].innerText);

                const buyAmount = Number.parseInt($('#NewOrderSection form[comanda=ordinnou].centru').find('input[name=cant]')[0]['value']);
                if (buyAmount == 0) return;

                const orderTotal = Number.parseFloat($('#NewOrderSection .ordinprev span[gi=valord]')[0].innerText.replace(',', ''));

                //do the calculations
                const todaysDate = getTodaysDate();
                const years = dateDiffYears(todaysDate, maturityDate) + 1 //difference in years rounded up
                const days = dateDiffDays(todaysDate, maturityDate);


                console.log('calculating bond YMT ...');

                const principal = bondPrice * buyAmount;
                const int1y = principal * bondinterestRate;
                const intAll = int1y * years;
                const profit = principal + intAll - orderTotal;
                const intPctAll = (principal + intAll) / orderTotal - 1;
                const intPct1y = intPctAll / years;
                const IntYMT = intPctAll * 365.25 / days;

                //output data
                setOutput(intPct1y, IntYMT, profit);
            } catch (e) {
                console.error(e);
                setOutput(999, 999, 0);
            }

        }, 1500));

    });

})()
