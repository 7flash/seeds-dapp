import { h } from 'hyperapp';

const Controls = ({
                    wallet: { accountName, status },
                    formFields: {
                      accountNameField,
                      plantAmountField,
                      unplantAmountField,
                      transferAmountField,
                      transferAccountField,
                      subscribeAmountField,
                      claimAmountField
                    } },
                  {
                    updateFormField,
                    wallet: {
                      requested: createAccount
                    },
                    transactions: {
                      transferSeeds,
                      plantSeeds,
                      unplantSeeds,
                      increaseSubscription,
                      claimReward
                    }
}) => (
  status == 'created' ? [
    [
      h('h3', {}, '2. Transfer'),
      h('input', {
        type: 'number',
        step: "0.0001",
        placeholder: 'Transfer amount (1.0000)',
        value: transferAmountField,
        oninput: updateFormField('transferAmountField')
      }),
      h('input', {
        type: 'text',
        minlength: 12,
        maxlength: 12,
        placeholder: 'Beneficiary account (12 symbols)',
        value: transferAccountField,
        oninput: updateFormField('transferAccountField')
      }),
      h('button', {
        onclick: [transferSeeds, {
          amount: transferAmountField,
          account: transferAccountField
        }]
      }, 'Send transaction')
    ],
    h('hr'),
    [
      h('h3', {}, '3. Plant seeds'),
      h('input', {
        type: 'number',
        step: "0.0001",
        placeholder: 'Seeds amount (1.0000)',
        value: plantAmountField,
        oninput: updateFormField('plantAmountField')
      }),
      h('button', {
        onclick: [plantSeeds, plantAmountField]
      }, 'Send transaction')
    ],
    h('hr'),
    [
      h('h3', {}, '4. Unplant seeds'),
      h('input', {
        type: 'number',
        step: "0.0001",
        placeholder: 'Seeds amount (1.0000)',
        value: unplantAmountField,
        oninput: updateFormField('unplantAmountField')
      }),
      h('button', {
        onclick: [unplantSeeds, unplantAmountField]
      }, 'Send transaction')
    ],
    h('hr'),
    [
      h('h3', {}, '5. Claim reward'),
      h('input', {
        type: 'number',
        step: '0.0001',
        placeholder: 'Seeds amount (1.0000)',
        value: claimAmountField,
        oninput: updateFormField('claimAmountField')
      }),
      h('button', {
        onclick: [claimReward, claimAmountField]
      }, 'Send transaction')
    ],
    h('hr'),
    [
      h('h3', {}, '6. Increase subscription'),
      h('input', {
        type: 'number',
        step: '0.0001',
        placeholder: 'Amount per minute (1.0000)',
        value: subscribeAmountField,
        oninput: updateFormField('subscribeAmountField')
      }),
      h('button', {
        onclick: [increaseSubscription, subscribeAmountField]
      }, 'Send transaction')
    ],
    h('hr')
  ] : [
    h('h3', {}, '1. Create account'),
    h('input', {
      type: 'text',
      minlength: 12,
      maxlength: 12,
      placeholder: 'Account name (12 symbols)',
      value: accountNameField,
      oninput: updateFormField('accountNameField')
    }),
    status == 'requested' ?
      h('h3', {}, 'Please wait for approval, do not refresh page...') :
      h('button', { onclick: [createAccount, accountNameField] }, 'Send transaction'),
    h('hr')
  ]);

export default Controls;
