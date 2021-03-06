// Output should be a valid TS-file:
module.exports = `// THIS FILE IS GENERATED BY 'npm run set-env-variables'

export const environment = {
  production: ${process.env.NG_PRODUCTION || true},

  // Feature-switches:

  // APIs:

  // Google Sheets API:
  google_sheets_api_url: '${process.env.GOOGLE_SHEETS_API_URL}',
  google_sheets_sheet_id: '${process.env.GOOGLE_SHEETS_SHEET_ID}',

  // Third-party tokens:
  ai_ikey: '${process.env.NG_AI_IKEY}',
  ai_endpoint: '${process.env.NG_AI_ENDPOINT}',
};
`;
