# DEV-05 normal capability content path

The BFF retains the existing content capability client, server-side gateway,
current CP context, exact estate/Market/locale checks and disabled-fallback proof
mode. The named disposable workload now requests exactly the existing allocated
CP and CMS audiences for resource calls, with `context:resolve` and
`content:entry:resolve`. It verifies the exact audience set and scope through
fresh issuer introspection; additional or missing audiences/scopes are refused.
Single-audience CP context acquisition is unchanged. No identity, validator
permission, preview permission or production client is activated by this change.

CMS independently rechecks current CP grant/binding/provider authority before
its native read and commits the audit before returning content. An estate-side
resolution therefore cannot replace the native CMS enforcement point. Every
proof read still gets current CP context and capability resolution; no positive
authority cache or public content fallback is introduced.

Shared content/v1 defines `/v1/content/resolve`. CP's invocation descriptor makes
`route_reference` optional, so an absent route selects that contract endpoint,
never the service origin's root. An explicit different path or origin is refused
before sending a content token. Protocol regressions cover an actual descriptor
without the route and rejection of an unrelated same-origin administrative path.

Local public-dependency protocol tests do not qualify private package access,
the full estate build, actual IAM, CP or CMS. Those remain the owning frozen
consumer CI and Infrastructure's fourteen original NAB-03 cases, including
normal published page/navigation/footer, missing-grant denial, native audit and
independent teardown. Synthetic development evidence grants no protected or
production authority.

The native issuer reports relative `expires_in` and absolute introspection `exp`
in whole seconds. Their comparison rounds only the received-at timestamp to
the next whole-second boundary; it allows less than one second of representation
difference. Absolute expiry must still be future, within the immutable proof
deadline and no more than 300 seconds from receipt. The response lifetime is
still a positive integer at most 300 seconds. An extra second beyond that
representation boundary, subject rotation, extra audience/scope, issuer outage
and deadline overrun remain denials. This fixes the connected BFF's refusal of
current native issuer tokens without extending the actual token's expiry.
