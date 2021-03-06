// Output should be a valid TS-file:
module.exports = `// THIS FILE IS GENERATED BY 'npm run set-env-variables'

export const environment = {
  production: ${process.env.NG_PRODUCTION || true},

  // Feature-switches:
  isDebug: ${process.env.NG_IS_DEBUG || 'false'},
  showDebug: ${process.env.NG_SHOW_DEBUG || 'false'},
  useAnimation: ${process.env.NG_USE_ANIMATION || 'true'},
  localStorage: ${process.env.NG_LOCAL_STORAGE || 'false'},
  alwaysShowTextPlayer: ${process.env.NG_ALWAYS_SHOW_TEXT_PLAYER || 'false'},

  locales: '${process.env.NG_LOCALES || 'en'}',

  // APIs:
  url_121_service_api: '${process.env.NG_URL_121_SERVICE_API}',
  url_pa_account_service_api: '${process.env.NG_URL_PA_ACCOUNT_SERVICE_API}',
  url_user_ims_api: '${process.env.NG_URL_USER_IMS_API}',

  // Third-party tokens:
  ai_ikey: '${process.env.NG_AI_IKEY}',
  ai_endpoint: '${process.env.NG_AI_ENDPOINT}',
};
`;
