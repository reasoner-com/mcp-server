# Technical Notes - UI/UX Minds Project

## Issue: Google Cloud Storage Signed URL Upload

### Problem Description
When attempting to upload VTT files to the Mind Reasoner platform using the signed URLs from the API, we consistently encounter a `SignatureDoesNotMatch` error (HTTP 403).

### Error Details
```xml
<Error>
  <Code>SignatureDoesNotMatch</Code>
  <Message>Access denied.</Message>
  <Details>The request signature we calculated does not match the signature you provided.
  Check your Google secret key and signing method.</Details>
</Error>
```

### Root Cause Analysis
The signed URL is generated with specific headers (including `Content-Type: text/vtt`) as part of the signature. However, when making the PUT request:

1. **Without Content-Type header**: Returns `MalformedSecurityHeader` - header expected but not provided
2. **With Content-Type header**: Returns `SignatureDoesNotMatch` - signature calculation mismatch

This suggests the HTTP client (curl, requests library, or MCP tool) is formatting the request in a way that differs from what Google Cloud Storage expects, causing the signature validation to fail.

### Attempted Solutions
1. ✗ Used MCP `upload_file_to_signed_url` tool - SignatureDoesNotMatch
2. ✗ Used curl with `--data-binary` - SignatureDoesNotMatch
3. ✗ Used Python requests library without Content-Type - MalformedSecurityHeader
4. ✗ Used Python requests library with Content-Type - SignatureDoesNotMatch

### Possible Causes
- URL encoding differences in query parameters
- Header canonicalization issues
- Request payload formatting
- Hidden characters or whitespace in headers
- MCP server implementation issue with signed URL uploads

### Workaround: Manual Upload via Web Interface
Since programmatic upload isn't working, files can be uploaded manually through the Mind Reasoner web interface:

1. Log in to https://app.mindreasoner.com
2. Navigate to the mind
3. Use the web UI to upload the VTT files directly
4. Create snapshots from the uploaded files

### Alternative Approaches to Explore
1. **Direct API Upload**: Check if Mind Reasoner API supports direct file upload (not via signed URL)
2. **Different Content-Type**: Try uploading as different MIME types
3. **Base64 Encoding**: Upload file content as base64-encoded JSON payload
4. **Contact Support**: Reach out to Mind Reasoner support about signed URL issues

## Successfully Completed Steps

### ✓ Project Setup
- Created organized folder structure
- Set up data, minds, simulations, and docs directories

### ✓ Mind Creation
Two digital minds successfully created via API:

**Luke Wroblewski**
- Mind ID: `b817f2f2-ad41-4be1-a7d8-55107b522ece`
- Digital Twin ID: `77910e97-ede5-4a1e-adde-011bf2da1a29`
- Status: Created, awaiting data upload

**Julie Zhou**
- Mind ID: `b610a536-7961-455e-bfa1-8f2bb794aa8e`
- Digital Twin ID: `d22e4c8d-7a29-45e1-9998-d68cf74294a9`
- Status: Created, awaiting data upload

### ✓ Profile Creation
Comprehensive profiles created in multiple formats:
- Text format (.txt) - detailed background and philosophy
- VTT format (.vtt) - conversational transcripts for Mind Reasoner
- Both profiles are research-based from industry sources

### ✓ Documentation
- README.md with complete project overview
- minds_info.json with all configuration data
- Python upload script (upload_minds.py)
- Bash upload script (test_upload.sh)
- This technical notes document

### ✓ Test Framework
Created automated test scripts that can:
- Get signed upload URLs
- Upload files (once upload issue is resolved)
- Create snapshots
- Monitor snapshot processing status
- Run test simulations with design scenarios

## ✅ SOLUTION FOUND: Direct File Upload to Snapshot Endpoint

### Working Method
Instead of the two-step process (get signed URL → upload to GCS), use direct file upload:

```bash
# Luke Wroblewski - ✓ SUCCESSFUL
curl -X POST "https://app.mindreasoner.com/api/public/v1/minds/b817f2f2-ad41-4be1-a7d8-55107b522ece/snapshots" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@data/luke_wroblewski_profile.vtt" \
  -F "digitalTwinId=77910e97-ede5-4a1e-adde-011bf2da1a29"

# Julie Zhou - ✓ SUCCESSFUL
curl -X POST "https://app.mindreasoner.com/api/public/v1/minds/b610a536-7961-455e-bfa1-8f2bb794aa8e/snapshots" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@data/julie_zhou_profile.vtt" \
  -F "digitalTwinId=d22e4c8d-7a29-45e1-9998-d68cf74294a9"
```

**Results:**
- Luke's Snapshot ID: `756ffb95-23eb-4323-9864-839e0de74538`
- Julie's Snapshot ID: `19317d9f-bad0-4f00-95b6-1e88856dd6a1`
- Status: Both processing successfully (started 2025-10-25)

## Next Steps

1. ✓ **Upload Complete** - Both files uploaded successfully
2. ⏳ **Snapshot Processing** - Currently processing (can take 10-15 minutes)
3. **Run Simulations** (After snapshots complete)
   - Use the MCP simulate tool or API directly
   - Test with prepared scenarios

## Contact & Support
- Mind Reasoner Support: support@mindreasoner.com
- API Documentation: https://docs.reasoner.com/mind-reasoner-api/api-reference

## Files Ready for Upload
- `/Users/mattysquarzoni/Documents/MR_demo_LVNG/uiux-minds-project/data/luke_wroblewski_profile.vtt`
- `/Users/mattysquarzoni/Documents/MR_demo_LVNG/uiux-minds-project/data/julie_zhou_profile.vtt`

Both files are properly formatted and ready to use.
