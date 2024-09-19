import axios from 'axios';
import * as https from 'https';

const runtimeConfig = useRuntimeConfig();

// let axiosInstance: any;

// await useFetch('/api').then((req) => {
//   console.log(req.data.value);
//   const agent = new https.Agent({
//     ca: req.data.value,
//     rejectUnauthorized: false,
//   });

//   axiosInstance = axios.create({
//     baseURL: runtimeConfig.public.backendApi,
//     timeout: 20000,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     httpsAgent: agent,
//   });
// });

const agent = new https.Agent({
  ca: `-----BEGIN CERTIFICATE-----
MIID8zCCAtsCFG2cz2D3TOXdxqrrxC/vaAokzHyJMA0GCSqGSIb3DQEBCwUAMIG1
MQswCQYDVQQGEwJSVTEVMBMGA1UECAwMVm9sb2dvZHNrYXlhMRQwEgYDVQQHDAtD
aGVyZXBvdmV0czEUMBIGA1UECgwLT09PIEtyaXB0b24xKzApBgNVBAsMIkNlcnRp
ZmljYXRlIEF1dGhvcml0eSBMb2NhbCBDZW50ZXIxFjAUBgNVBAMMDXRvdWNob24u
bG9jYWwxHjAcBgkqhkiG9w0BCQEWD3ZuQHRvdWNob24udGVjaDAeFw0yNDA4Mjgw
NzIwNThaFw00NDA4MjMwNzIwNThaMIG1MQswCQYDVQQGEwJSVTEVMBMGA1UECAwM
Vm9sb2dvZHNrYXlhMRQwEgYDVQQHDAtDaGVyZXBvdmV0czEUMBIGA1UECgwLT09P
IEtyaXB0b24xKzApBgNVBAsMIkNlcnRpZmljYXRlIEF1dGhvcml0eSBMb2NhbCBD
ZW50ZXIxFjAUBgNVBAMMDXRvdWNob24ubG9jYWwxHjAcBgkqhkiG9w0BCQEWD3Zu
QHRvdWNob24udGVjaDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAM/3
1PFPLU1t3e9CltvB2qzLKolxsbWTpI2YG4RV94QbO+XRean2s5rB3It3vN7qvtsP
9WxoBK2ls3AAGAbVSycHT53lOn/jQoLJ3xOECXJY+PRYVgxtHcd4OILVJ7zWb9hD
mFSnlikBOe46F9F/Bk3KX9rTOaWd8V78xYgCglPnzM1N2eaHkT2+qv2MWZtGJ2hS
0eM/vvYbWLDXNay3Y5sUaCDsKf5Am2xpTZqFc0wuRQmAZVKbYo/Wk/V1QOVhW4Ri
gQ7M9gCuFfL6yffpztf8VcJmA7Bb1o6aGA6EBuJCucFBaczVuWjDo4RBoV1YV3Uk
3VC9Kgxv+3EJRP+dy0kCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAGkn4docpoapb
wKmM/bR7A8wjK0NFYCHQK5ap7BNbs3k91k68+je9U095KEJgpAOsiEJFsxKJrei7
er8cOWvW77RX4ddntw4Y6pcqd4WNMfMxQ4QVy8c0qCISVE4xPGKJ/fdodYOBjm7M
GRMaXsZKsU6fdIx4+IaJZpC8frI/kjGd1s85iWVQiZ+QBk4wquVWMQu0kqXMIEpU
UWOEmJ5qndpPK+g18KfPm0ocgpVf7DD1jTgw+PxcMHKdCFcOrUD+4ppRz5xjk4R5
llsXVnsTWok5/sWzEovAFUQeEUIcOCkjzGketGD31j/E7l+QHN48i5r71hNEAkN0
ywOeBqS4Qw==
-----END CERTIFICATE-----
`,
  rejectUnauthorized: false,
});

const axiosInstance = axios.create({
  baseURL: runtimeConfig.public.backendApi,
  timeout: 20000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  httpsAgent: agent,
});

export default axiosInstance;
