# Meta Events Manager Checklist

Use this checklist after deploying attribution code changes.

## 1) Confirm Custom Events

- Open Meta Events Manager for dataset `catfish_crasher_dataset`.
- Go to the custom event review/confirmation section.
- Confirm ownership for app events in use (for example: `PurchaseCompleted`, `ScanCompleted`, `PictureTaken`, `SignIn`, `SignUp`).

## 2) Validate Campaign Parameters in Test Events

- Open **Test Events** for the same dataset.
- Trigger app events using a deep link that includes campaign params.
- Confirm incoming events include campaign attribution fields where available:
  - `campaign_id`
  - `campaign_name`
  - `adset_id`
  - `ad_id`
  - `utm_campaign`
  - `fbc`
  - `fbp`

## 3) Validate CAPI Propagation

- Check Lambda logs for `meta-capi-handler` and confirm `Meta CAPI attribution fields` log lines.
- Ensure `has_campaign_id` and/or `has_fbc` / `has_fbp` are `true` for attributed traffic.

## 4) Re-check Event Quality Diagnostics

- Return to Events Manager diagnostics.
- Monitor for 24–72 hours after release (Meta diagnostics are delayed).
- Expect reduction/clearance of:
  - Campaign ID parameter quality warning.
  - Custom event ownership warning (after manual confirmation).

## 5) Production Verification

- Compare conversion event quality before/after rollout.
- Confirm purchase-related events include attribution fields on live traffic.
- If warnings persist:
  - verify ad links still include campaign params,
  - verify app receives the deep links,
  - verify CAPI logs show attributed fields.
