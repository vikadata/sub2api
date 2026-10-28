import { describe, expect, it } from 'vitest'
import {
  CREEM_CURRENCY_OPTIONS,
  PAYMENT_CURRENCY_OPTIONS,
  PROVIDER_CONFIG_FIELDS,
  PROVIDER_SUPPORTED_TYPES,
  WEBHOOK_PATHS,
} from '@/components/payment/providerConfig'

function findField(providerKey: string, key: string) {
  const fields = PROVIDER_CONFIG_FIELDS[providerKey] || []
  return fields.find(field => field.key === key)
}

describe('PROVIDER_CONFIG_FIELDS.wxpay', () => {
  it('keeps admin form validation aligned with backend-required credentials', () => {
    expect(findField('wxpay', 'publicKeyId')?.optional).toBeFalsy()
    expect(findField('wxpay', 'certSerial')?.optional).toBeFalsy()
  })

  it('only keeps the simplified visible credential set in the admin form', () => {
    expect(findField('wxpay', 'mpAppId')).toBeUndefined()
    expect(findField('wxpay', 'h5AppName')).toBeUndefined()
    expect(findField('wxpay', 'h5AppUrl')).toBeUndefined()
  })
})

describe('PROVIDER_CONFIG_FIELDS.airwallex', () => {
  it('adds currency config with CNY as the default', () => {
    const currency = findField('airwallex', 'currency')

    expect(currency?.defaultValue).toBe('CNY')
    expect(currency?.hintKey).toBe('admin.settings.payment.field_paymentCurrencyHint')
    expect(currency?.options).toBe(PAYMENT_CURRENCY_OPTIONS)
  })

  it('marks accountId as optional and explains when it can be left blank', () => {
    const accountId = findField('airwallex', 'accountId')

    expect(accountId?.optional).toBe(true)
    expect(accountId?.clearable).toBe(true)
    expect(accountId?.hintKey).toBe('admin.settings.payment.field_accountIdHint')
  })

  it('explains that apiBase must match the Airwallex key environment', () => {
    expect(findField('airwallex', 'apiBase')?.hintKey).toBe('admin.settings.payment.field_airwallexApiBaseHint')
  })
})

describe('PROVIDER_CONFIG_FIELDS.creem', () => {
  it('requires the credentials and product the backend validates', () => {
    for (const key of ['apiKey', 'webhookSecret', 'productId']) {
      expect(findField('creem', key)?.optional).toBeFalsy()
    }
    expect(findField('creem', 'apiKey')?.sensitive).toBe(true)
    expect(findField('creem', 'webhookSecret')?.sensitive).toBe(true)
  })

  it('limits currency to USD/EUR and defaults to USD instead of CNY', () => {
    const currency = findField('creem', 'currency')

    expect(currency?.defaultValue).toBe('USD')
    expect(currency?.options).toBe(CREEM_CURRENCY_OPTIONS)
    expect(CREEM_CURRENCY_OPTIONS.map(o => o.value)).toEqual(['USD', 'EUR'])
  })

  it('lets apiBase be left blank so the key prefix picks the environment', () => {
    expect(findField('creem', 'apiBase')?.optional).toBe(true)
    expect(findField('creem', 'apiBase')?.defaultValue).toBeUndefined()
  })

  it('registers the creem payment type and webhook path', () => {
    expect(PROVIDER_SUPPORTED_TYPES.creem).toEqual(['creem'])
    expect(WEBHOOK_PATHS.creem).toBe('/api/v1/payment/webhook/creem')
  })
})

describe('PROVIDER_CONFIG_FIELDS.stripe', () => {
  it('adds currency config with CNY as the default', () => {
    const currency = findField('stripe', 'currency')

    expect(currency?.defaultValue).toBe('CNY')
    expect(currency?.hintKey).toBe('admin.settings.payment.field_paymentCurrencyHint')
    expect(currency?.options).toBe(PAYMENT_CURRENCY_OPTIONS)
  })
})
