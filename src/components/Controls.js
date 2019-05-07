import { h } from 'hyperapp';

const Controls = ({
                    wallet: { accountName },
                    formFields: {
                      accountNameField,
                      plantAmountField,
                      transferAmountField,
                      transferAccountField,
                      subscribeAmountField
                    }
                  }, {
                    updateFormField,
                    createAccount,
                    transferSeeds,
                    plantSeeds,
                    increaseSubscription
}) => (
  accountName ? [
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
        onclick: [transferSeeds.request, {
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
        onclick: [plantSeeds.request, plantAmountField]
      }, 'Send transaction')
    ],
    h('hr'),
    [
      h('h3', {}, '4. Increase subscription'),
      h('input', {
        type: 'number',
        step: '0.0001',
        placeholder: 'Amount per minute (1.0000)',
        value: subscribeAmountField,
        oninput: updateFormField('subscribeAmountField')
      }),
      h('button', {
        onclick: [increaseSubscription.request, [subscribeAmountField]]
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
    h('button', { onclick: [createAccount.request, accountNameField] }, 'Send transaction'),
    h('hr')
  ]);

export default Controls;
