---
title: Getting Started with the Mind Reasoner API
subtitle: 'Create a mind, upload data, and run your first simulation in minutes.'
slug: getting-started-mind-reasoner-api
---
![Mind Reasoner API](file:6b5e59fa-2bf8-43ae-8eb9-7d4ad71b2671)

<div className="release-notes">
  <Callout intent="success" title="See What's Really Happening" icon="eye">
    The Mind Reasoner API allows you to programmatically create <Tooltip tip="A 'mind' is the core digital entity that holds the data and personality model for a specific person.">digital minds</Tooltip>, populate them with conversational data, and run powerful simulations to get an accurate preview of how the person will think, feel, say, and act in any scenario. This guide will walk you through the entire process in three core steps.
  </Callout>

<h2>Prerequisites</h2>

  Before you begin, make sure you have your API key. You can get this from your Mind Reasoner account dashboard. You will pass the API key as a `<Tooltip tip="A security token that grants the 'bearer' of the token access to a protected resource.">`Bearer token`</Tooltip>` in the `Authorization` header of every request.

  This guide provides interactive code examples in today's most popular languages. Use the tabs to select your language—the choice will sync across all examples on the page.

<CodeBlocks>
    ```bash title="cURL"
    # cURL is pre-installed on most macOS, Linux, and modern Windows systems.
    # No installation is needed.
    ```
    ```javascript title="Node.js"
    # Install the axios library to make HTTP requests
    npm install axios
    ```
    ```python title="Python"
    # Install the requests library to make HTTP requests
    pip install requests
    ```
    ```php title="PHP"
    # No special installation needed if you have the cURL extension enabled
    # For a more robust solution, consider a library like Guzzle:
    # composer require guzzlehttp/guzzle
    ```
    ```ruby title="Ruby"
    # No special installation needed for the built-in Net::HTTP library
    # For a simpler experience, consider a gem like HTTParty:
    # gem install httparty
    ```
    ```go title="Go"
    # No special installation needed. Go's standard library is used.
    ```
  </CodeBlocks>

  The following examples use placeholder variables. Hover over them in the code to see what they mean and where to find their values.

<h2>The 3-Step Workflow</h2>

<Steps>
    <Step title="Step 1: Create Your First Mind">
      First, create a "mind." This is the core entity that will hold the data and personality model. Send a `POST` request to the `/minds` endpoint with the name of the mind you want to create.

    <Template
        data={{ API_KEY: "YOUR_API_KEY", MIND_NAME: "Example Mind" }}
        tooltips={{
          API_KEY: (`<p>`
              Your secret API Key.
              `<br /><br />`
              Find this in your `<a href="#">`Account Dashboard`</a>`. Keep it secure.
            `</p>`
          ),
          MIND_NAME: (
            `<p>`
              A human-readable name for your mind. You can change this at any time.
            `</p>`
          )
        }}
      >
        `<CodeBlocks>`
          ``bash title="cURL"           curl -X POST https://app.mindreasoner.com/api/public/v1/minds \             -H "Authorization: Bearer {{API_KEY}}" \             -H "Content-Type: application/json" \             -d '{"name": "{{MIND_NAME}}"}'           ``
          ```javascript title="Node.js"
          import axios from 'axios';

    const apiKey = '{{API_KEY}}';
          const url = 'https://app.mindreasoner.com/api/public/v1/minds';

    const createMind = async () => {
            try {
              const response = await axios.post(url, {
                name: 'Example Mind'
              }, {
                headers: {
                  'Authorization':`Bearer ${apiKey}`,
                  'Content-Type': 'application/json'
                }
              });
              console.log('Mind created successfully:');
              console.log(JSON.stringify(response.data, null, 2));
            } catch (error) {
              console.error('Error creating mind:', error.response.data);
            }
          };

    createMind();python title="Python"
          import requests
          import json

    api_key = '{{API_KEY}}'
          url = 'https://app.mindreasoner.com/api/public/v1/minds'

    headers = {
              'Authorization': f'Bearer {api_key}',
              'Content-Type': 'application/json'
          }
          payload = {
              'name': 'Example Mind'
          }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
              print("Mind created successfully:")
              print(json.dumps(response.json(), indent=2))
          else:
              print(f"Error creating mind: {response.status_code}")
              print(response.text)php title="PHP"
          <?php
          $apiKey = '{{API_KEY}}';
          $url = 'https://app.mindreasoner.com/api/public/v1/minds';

    $data = ['name' => 'Example Mind'];$payload = json_encode($data);

    $ch = curl_init($url);
          curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
          curl_setopt($ch, CURLOPT_POST, true);
          curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
          curl_setopt($ch, CURLOPT_HTTPHEADER, [
              'Authorization: Bearer ' . $apiKey,
              'Content-Type: application/json'
          ]);

    $response = curl_exec($ch);
          $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
          curl_close($ch);

    if ($httpCode == 200) {
              echo "Mind created successfully:\n";$jsonResponse = json_decode($response, true);
              echo json_encode($jsonResponse, JSON_PRETTY_PRINT);
          } else {
              echo "Error creating mind: " . $response;
          }
          ?>
          ruby title="Ruby"
          require 'uri'
          require 'net/http'
          require 'json'

    api_key = '{{API_KEY}}'
          url = URI("https://app.mindreasoner.com/api/public/v1/minds")

    http = Net::HTTP.new(url.host, url.port)
          http.use_ssl = true

    request = Net::HTTP::Post.new(url)
          request["Authorization"] = "Bearer #{api_key}"
          request["Content-Type"] = "application/json"
          request.body = JSON.dump({ "name" => "Example Mind" })

    response = http.request(request)

    puts "Mind created successfully:"
          puts JSON.pretty_generate(JSON.parse(response.read_body))go title="Go"
          package main

    import (
          	"bytes"
          	"encoding/json"
          	"fmt"
          	"io"
          	"net/http"
          )

    func main() {
          	apiKey := "{{API_KEY}}"
          	url := "https://app.mindreasoner.com/api/public/v1/minds"

    payload := map[string]string{"name": "Example Mind"}
          	jsonPayload, _ := json.Marshal(payload)

    req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonPayload))
          	req.Header.Set("Authorization", "Bearer "+apiKey)
          	req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
          	resp, err := client.Do(req)
          	if err != nil {
          		panic(err)
          	}
          	defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
          	fmt.Println("Mind created successfully:")

    var prettyJSON bytes.Buffer
              json.Indent(&prettyJSON, body, "", "  ")
              fmt.Println(string(prettyJSON.Bytes()))
          }
          ````</CodeBlocks>`
      `</Template>`

    The API will respond with the new mind's data.**Save the `id` from the `mind` object and the `id` from the `digitalTwin` object.** You will need them for the next steps.

    ``json {3,8}       {         "mind": {           "id": "123e4567-e89b-12d3-a456-426614174000", // <-- Save this mindId           "name": "Example Mind",           // ...         },         "digitalTwin": {           "id": "abcde123-e89b-12d3-a456-426614174001", // <-- Save this digitalTwinId           "name": "Default",           // ...         },         // ...       }       ``
    `</Step>`

    `<Step title="Step 2: Upload a Data Snapshot">`
      Now, let's give the mind some knowledge by uploading a `<Tooltip tip="The source material, such as a conversation transcript, used to teach the mind.">`data file`</Tooltip>` (like a conversation transcript in `.vtt`, `.docx`, or `.pdf` format). This creates a `<Tooltip tip="A point-in-time capture of the mind's knowledge and personality, created from a data file.">`snapshot`</Tooltip>` of the mind's state.

    `<Info title="Part A: Get a Secure Upload URL" icon="lock">`
        First, ask the API for a special, one-time URL to upload your file.

    <Template
          data={{ API_KEY: "YOUR_API_KEY", MIND_ID: "YOUR_MIND_ID" }}
          tooltips={{
            API_KEY:`<p>`Your secret API Key from your dashboard.`</p>`,
            MIND_ID: `<p>`The unique ID for your mind, which you received in the response from Step 1.`</p>`
            CONTENT_TYPE: `<p>`The MIME type of the file you are uploading. Defaults to 'application/octet-stream'. You can specify 'text/vtt', 'application/pdf', or 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'.`</p>`
          }}
        >
          `<CodeBlocks>`
            ``bash title="cURL"             curl -X GET "https://app.mindreasoner.com/api/public/v1/minds/{{MIND_ID}}/signed-url" \               -H "Authorization: Bearer {{API_KEY}}"             ``
            ```javascript title="Node.js"
            import axios from 'axios';

    const apiKey = '{{API_KEY}}';
            const mindId = '{{MIND_ID}}'; // <-- From Step 1
            const url =`https://app.mindreasoner.com/api/public/v1/minds/${mindId}/signed-url&contentType={{CONTENT_TYPE}}`;

    const getUploadUrl = async () => {
              try {
                const response = await axios.get(url, {
                  headers: { 'Authorization':`Bearer ${apiKey}` }
                });
                console.log('Secure URL received:');
                console.log(JSON.stringify(response.data, null, 2));
              } catch (error) {
                console.error('Error getting URL:', error.response.data);
              }
            };

    getUploadUrl();python title="Python"
            import requests
            import json

    api_key = '{{API_KEY}}'
            mind_id = '{{MIND_ID}}' # <-- From Step 1
            url = f'https://app.mindreasoner.com/api/public/v1/minds/{mind_id}/signed-url'

    headers = {'Authorization': f'Bearer {api_key}'}
            response = requests.get(url, headers=headers)

    if response.status_code == 200:
                print("Secure URL received:")
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Error getting URL: {response.status_code}")
                print(response.text)php title="PHP"
            <?php
            $apiKey = '{{API_KEY}}';
            $mindId = '{{MIND_ID}}'; // <-- From Step 1
            $url = "https://app.mindreasoner.com/api/public/v1/minds/{$mindId}/signed-url";

    $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $apiKey]);

    $response = curl_exec($ch);
            curl_close($ch);

    echo "Secure URL received:\n";$jsonResponse = json_decode($response, true);
            echo json_encode($jsonResponse, JSON_PRETTY_PRINT);
            ?>
            ruby title="Ruby"
            require 'uri'
            require 'net/http'
            require 'json'

    api_key = '{{API_KEY}}'
            mind_id = '{{MIND_ID}}' # <-- From Step 1
            url = URI("https://app.mindreasoner.com/api/public/v1/minds/#{mind_id}/signed-url")

    http = Net::HTTP.new(url.host, url.port)
            http.use_ssl = true
            request = Net::HTTP::Get.new(url)
            request["Authorization"] = "Bearer #{api_key}"

    response = http.request(request)
            puts "Secure URL received:"
            puts JSON.pretty_generate(JSON.parse(response.read_body))go title="Go"
            package main

    import (
            	"bytes"
            	"encoding/json"
            	"fmt"
            	"io"
            	"net/http"
            )

    func main() {
            	apiKey := "{{API_KEY}}"
            	mindId := "{{MIND_ID}}" // <-- From Step 1
            	url := fmt.Sprintf("https://app.mindreasoner.com/api/public/v1/minds/%s/signed-url", mindId)

    req, _ := http.NewRequest("GET", url, nil)
            	req.Header.Set("Authorization", "Bearer "+apiKey)

    client := &http.Client{}
            	resp, err := client.Do(req)
            	if err != nil { panic(err) }
            	defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
            	fmt.Println("Secure URL received:")
              var prettyJSON bytes.Buffer
              json.Indent(&prettyJSON, body, "", "  ")
              fmt.Println(string(prettyJSON.Bytes()))
            }
            ````</CodeBlocks>`
        `</Template>`

    The response will contain a`signedUrl` and an `artifactId`. **Save the `artifactId`**.

    ``json {4}         {           "signedUrl": "https://storage.googleapis.com/...", // <-- The temporary upload destination           "fileName": "...",           "artifactId": "fedcba98-e89b-12d3-a456-426614174002" // <-- Save this artifactId         }         ``
      `</Info>`

    `<Info title="Part B: Upload Your File" icon="upload">`
        Next, use the `signedUrl` to upload your local file. This is a `PUT` request where the body is your file's content.

    <Template
          data={{ SIGNED_URL: "YOUR_SIGNED_URL" }}
          tooltips={{
            SIGNED_URL:`<p>`The temporary, secure URL for file uploads, which you received in the response from Part A.`</p>`
            CONTENT_TYPE:`<p>`The MIME type of the file you are uploading. It must match the contentType parameter in the get_signed_upload_url tool.`</p>`
          }}
        >
          `<CodeBlocks>`
            ``bash title="cURL"             curl -X PUT "{{SIGNED_URL}}" \               -H "Content-Type: {{CONTENT_TYPE}}" \               --data-binary "@/path/to/your/transcript.vtt"             ``
            ```javascript title="Node.js"
            import axios from 'axios';
            import fs from 'fs';

    const signedUrl = '{{SIGNED_URL}}'; // <-- From Part A
            const filePath = '/path/to/your/transcript.vtt';
            const contentType = '{{CONTENT_TYPE}}'; // <-- From Part A

    const uploadFile = async () => {
              try {
                const fileContent = fs.readFileSync(filePath);
                await axios.put(signedUrl, fileContent, {
                  headers: { 'Content-Type': contentType }
                });
                console.log('File uploaded successfully.');
              } catch (error) {
                console.error('Error uploading file:', error.message);
              }
            };

    uploadFile();python title="Python"
            import requests

    signed_url = '{{SIGNED_URL}}' # <-- From Part A
            file_path = '/path/to/your/transcript.vtt'
            content_type = '{{CONTENT_TYPE}}' # <-- From Part A

    with open(file_path, 'rb') as f:
                headers = {'Content-Type': '{{CONTENT_TYPE}}'}
                response = requests.put(signed_url, data=f, headers=headers)

    if response.status_code == 200:
                    print("File uploaded successfully.")
                else:
                    print(f"Error uploading file: {response.status_code}")
                    print(response.text)php title="PHP"
            <?php
            $signedUrl = '{{SIGNED_URL}}'; // <-- From Part A
            $filePath = '/path/to/your/transcript.vtt';
            $contentType = 'text/vtt'; // Adjust for your file type

    $fileContent = file_get_contents($filePath);

    $ch = curl_init($signedUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
            curl_setopt($ch, CURLOPT_POSTFIELDS, $fileContent);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: ' . $contentType]);

    curl_exec($ch);$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

    if ($httpCode == 200) {
                echo "File uploaded successfully.";
            } else {
                echo "Error uploading file. Status: " . $httpCode;
            }
            ?>ruby title="Ruby"
            require 'uri'
            require 'net/http'

    signed_url = '{{SIGNED_URL}}' # <-- From Part A
            file_path = '/path/to/your/transcript.vtt'
            content_type = '{{CONTENT_TYPE}}' # <-- From Part A

    url = URI(signed_url)
            http = Net::HTTP.new(url.host, url.port)
            http.use_ssl = true

    request = Net::HTTP::Put.new(url)
            request["Content-Type"] = '{{CONTENT_TYPE}}' # <-- From Part A
            request.body = File.read(file_path)

    response = http.request(request)
            if response.code == "200"
              puts "File uploaded successfully."
            else
              puts "Error uploading file: #{response.code}"
            endgo title="Go"
            package main

    import (
            	"fmt"
            	"net/http"
            	"os"
            )

    func main() {
            	signedURL := "{{SIGNED_URL}}" // <-- From Part A
            	filePath := "/path/to/your/transcript.vtt"
            	contentType := "{{CONTENT_TYPE}}" // <-- From Part A

    file, err := os.Open(filePath)
            	if err != nil { panic(err) }
            	defer file.Close()

    req, _ := http.NewRequest("PUT", signedURL, file)
            	req.Header.Set("Content-Type", contentType)

    client := &http.Client{}
            	resp, err := client.Do(req)
            	if err != nil { panic(err) }
            	defer resp.Body.Close()

    if resp.StatusCode == http.StatusOK {
            		fmt.Println("File uploaded successfully.")
            	} else {
            		fmt.Printf("Error uploading file: %s\n", resp.Status)
            	}
            }
            ````</CodeBlocks>`
        `</Template>`
      `</Info>`

    `<Info title="Part C: Create the Snapshot" icon="camera">`
        Finally, tell Mind Reasoner to process the uploaded file. Send a `POST` request using the IDs you saved.

    <Template
          data={{
            API_KEY: "YOUR_API_KEY",
            MIND_ID: "YOUR_MIND_ID",
            DIGITAL_TWIN_ID: "YOUR_DIGITAL_TWIN_ID",
            ARTIFACT_ID: "YOUR_ARTIFACT_ID"
          }}
          tooltips={{
            API_KEY:`<p>`Your secret API Key.`</p>`,
            MIND_ID: `<p>`The ID for your mind from Step 1.`</p>`,
            DIGITAL_TWIN_ID: `<p>`The ID for the mind's default digital twin, also from Step 1.`</p>`,
            ARTIFACT_ID: `<p>`The ID for your uploaded file from Step 2, Part A.`</p>`
          }}
        >
          `<CodeBlocks>`
            ``bash title="cURL"             curl -X POST "https://app.mindreasoner.com/api/public/v1/minds/{{MIND_ID}}/snapshots" \               -H "Authorization: Bearer {{API_KEY}}" \               -F "digitalTwinId={{DIGITAL_TWIN_ID}}" \               -F "artifactId={{ARTIFACT_ID}}"             ``
            ```javascript title="Node.js"
            import axios from 'axios';
            import FormData from 'form-data';

    const apiKey = '{{API_KEY}}';
            const mindId = '{{MIND_ID}}';
            const digitalTwinId = '{{DIGITAL_TWIN_ID}}';
            const artifactId = '{{ARTIFACT_ID}}';

    const url =`https://app.mindreasoner.com/api/public/v1/minds/${mindId}/snapshots`;

    const createSnapshot = async () => {
              const form = new FormData();
              form.append('digitalTwinId', digitalTwinId);
              form.append('artifactId', artifactId);

    try {
                const response = await axios.post(url, form, {
                  headers: {
                    ...form.getHeaders(),
                    'Authorization':`Bearer ${apiKey}`
                  }
                });
                console.log('Snapshot creation started:');
                console.log(JSON.stringify(response.data, null, 2));
              } catch (error) {
                console.error('Error creating snapshot:', error.response.data);
              }
            };

    createSnapshot();python title="Python"
            import requests
            import json

    api_key = '{{API_KEY}}'
            mind_id = '{{MIND_ID}}'

    url = f'https://app.mindreasoner.com/api/public/v1/minds/{mind_id}/snapshots'
            headers = {'Authorization': f'Bearer {api_key}'}

    data = {
                'digitalTwinId': '{{DIGITAL_TWIN_ID}}',
                'artifactId': '{{ARTIFACT_ID}}'
            }

    response = requests.post(url, headers=headers, files=data)

    if response.status_code == 200:
                print("Snapshot creation started:")
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Error: {response.status_code}")
                print(response.text)php title="PHP"
            <?php
            $apiKey = '{{API_KEY}}';
            $mindId = '{{MIND_ID}}';

    $url = "https://app.mindreasoner.com/api/public/v1/minds/{$mindId}/snapshots";

    $postData = [
                'digitalTwinId' => '{{DIGITAL_TWIN_ID}}',
                'artifactId' => '{{ARTIFACT_ID}}'
            ];

    $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $apiKey]);

    $response = curl_exec($ch);
            curl_close($ch);

    echo "Snapshot creation started:\n";$jsonResponse = json_decode($response, true);
            echo json_encode($jsonResponse, JSON_PRETTY_PRINT);
            ?>
            ruby title="Ruby"
            require 'uri'
            require 'net/http'
            require 'json'

    api_key = '{{API_KEY}}'
            mind_id = '{{MIND_ID}}'

    url = URI("https://app.mindreasoner.com/api/public/v1/minds/#{mind_id}/snapshots")

    http = Net::HTTP.new(url.host, url.port)
            http.use_ssl = true

    request = Net::HTTP::Post.new(url)
            request["Authorization"] = "Bearer #{api_key}"
            form_data = [
              ['digitalTwinId', '{{DIGITAL_TWIN_ID}}'],
              ['artifactId', '{{ARTIFACT_ID}}']
            ]
            request.set_form form_data, 'multipart/form-data'

    response = http.request(request)
            puts "Snapshot creation started:"
            puts JSON.pretty_generate(JSON.parse(response.read_body))go title="Go"
            package main

    import (
            	"bytes"
            	"encoding/json"
            	"fmt"
            	"io"
            	"mime/multipart"
            	"net/http"
            )

    func main() {
            	apiKey := "{{API_KEY}}"
            	mindId := "{{MIND_ID}}"
            	url := fmt.Sprintf("https://app.mindreasoner.com/api/public/v1/minds/%s/snapshots", mindId)

    body := &bytes.Buffer{}
            	writer := multipart.NewWriter(body)
            	writer.WriteField("digitalTwinId", "{{DIGITAL_TWIN_ID}}")
            	writer.WriteField("artifactId", "{{ARTIFACT_ID}}")
            	writer.Close()

    req, _ := http.NewRequest("POST", url, body)
            	req.Header.Set("Authorization", "Bearer "+apiKey)
            	req.Header.Set("Content-Type", writer.FormDataContentType())

    client := &http.Client{}
            	resp, err := client.Do(req)
            	if err != nil { panic(err) }
            	defer resp.Body.Close()

    respBody, _ := io.ReadAll(resp.Body)
            	fmt.Println("Snapshot creation started:")
              var prettyJSON bytes.Buffer
              json.Indent(&prettyJSON, respBody, "", "  ")
              fmt.Println(string(prettyJSON.Bytes()))
            }
            ````</CodeBlocks>`
        `</Template>`

    The response will give you a`mindAssessmentId`. **Save this ID**, as it's your snapshot's unique identifier.

    ``json {3}         {           "message": "Mind assessment started",           "mindAssessmentId": "98765432-e89b-12d3-a456-426614174003", // <-- Save this snapshotId           "artifactId": "fedcba98-e89b-12d3-a456-426614174002"         }         ``
      `</Info>`
    `</Step>`

    `<Step title="Step 3: Run Your First Simulation">`
      Snapshot processing is `<Tooltip tip="This means the process runs in the background. You must check its status periodically rather than waiting for an immediate result.">`asynchronous`</Tooltip>`. Before you can run a simulation, you must check its status.

    `<Tip title="Check Snapshot Status" icon="hourglass">`
        Poll the `/status` endpoint using your `mindId` and the `snapshotId` (`mindAssessmentId`) until the `status` is `completed`.

    <Template
          data={{
            API_KEY: "YOUR_API_KEY",
            MIND_ID: "YOUR_MIND_ID",
            SNAPSHOT_ID: "YOUR_SNAPSHOT_ID"
          }}
          tooltips={{
            API_KEY:`<p>`Your secret API Key.`</p>`,
            MIND_ID: `<p>`The ID for your mind from Step 1.`</p>`,
            SNAPSHOT_ID: `<p>`The `mindAssessmentId` you received from Step 2, Part C.`</p>`
          }}
        >
          `<CodeBlocks>`
            ``bash title="cURL"             curl -X GET "https://app.mindreasoner.com/api/public/v1/minds/{{MIND_ID}}/snapshots/{{SNAPSHOT_ID}}/status" \               -H "Authorization: Bearer {{API_KEY}}"             ``
            ```javascript title="Node.js"
            import axios from 'axios';

    const apiKey = '{{API_KEY}}';
            const mindId = '{{MIND_ID}}';
            const snapshotId = '{{SNAPSHOT_ID}}';
            const url =`https://app.mindreasoner.com/api/public/v1/minds/${mindId}/snapshots/${snapshotId}/status`;

    const checkStatus = async () => {
              try {
                const response = await axios.get(url, {
                  headers: { 'Authorization':`Bearer ${apiKey}` }
                });
                console.log('Snapshot status:');
                console.log(JSON.stringify(response.data, null, 2));
              } catch (error) {
                console.error('Error checking status:', error.response.data);
              }
            };

    checkStatus();python title="Python"
            import requests
            import json

    api_key = '{{API_KEY}}'
            mind_id = '{{MIND_ID}}'
            snapshot_id = '{{SNAPSHOT_ID}}'
            url = f'https://app.mindreasoner.com/api/public/v1/minds/{mind_id}/snapshots/{snapshot_id}/status'

    headers = {'Authorization': f'Bearer {api_key}'}
            response = requests.get(url, headers=headers)

    print("Snapshot status:")
            print(json.dumps(response.json(), indent=2))php title="PHP"
            <?php
            $apiKey = '{{API_KEY}}';
            $mindId = '{{MIND_ID}}';
            $snapshotId = '{{SNAPSHOT_ID}}';
            $url = "https://app.mindreasoner.com/api/public/v1/minds/{$mindId}/snapshots/{$snapshotId}/status";

    $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $apiKey]);

    $response = curl_exec($ch);
            curl_close($ch);

    echo "Snapshot status:\n";$jsonResponse = json_decode($response, true);
            echo json_encode($jsonResponse, JSON_PRETTY_PRINT);
            ?>
            ruby title="Ruby"
            require 'uri'
            require 'net/http'
            require 'json'

    api_key = '{{API_KEY}}'
            mind_id = '{{MIND_ID}}'
            snapshot_id = '{{SNAPSHOT_ID}}'
            url = URI("https://app.mindreasoner.com/api/public/v1/minds/#{mind_id}/snapshots/#{snapshot_id}/status")

    http = Net::HTTP.new(url.host, url.port)
            http.use_ssl = true
            request = Net::HTTP::Get.new(url)
            request["Authorization"] = "Bearer #{api_key}"

    response = http.request(request)
            puts "Snapshot status:"
            puts JSON.pretty_generate(JSON.parse(response.read_body))go title="Go"
            package main

    import (
            	"bytes"
            	"encoding/json"
            	"fmt"
            	"io"
            	"net/http"
            )

    func main() {
            	apiKey := "{{API_KEY}}"
            	mindId := "{{MIND_ID}}"
            	snapshotId := "{{SNAPSHOT_ID}}"
            	url := fmt.Sprintf("https://app.mindreasoner.com/api/public/v1/minds/%s/snapshots/%s/status", mindId, snapshotId)

    req, _ := http.NewRequest("GET", url, nil)
            	req.Header.Set("Authorization", "Bearer "+apiKey)

    client := &http.Client{}
            	resp, err := client.Do(req)
            	if err != nil { panic(err) }
            	defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
            	fmt.Println("Snapshot status:")
              var prettyJSON bytes.Buffer
              json.Indent(&prettyJSON, body, "", "  ")
              fmt.Println(string(prettyJSON.Bytes()))
            }
            ````</CodeBlocks>`
        `</Template>`

    **Wait for this response:**
        ``json {3}         {           "id": "98765432-e89b-12d3-a456-426614174003",           "status": "completed",           // ...         }         ``
      `</Tip>`

    Once the snapshot is complete, you can run a simulation. Send a`POST` request to the `/simulate` endpoint with your `**mindId**` and a `<Tooltip tip="The scenario you want the mind to simulate accurate reactions to.">`scenario`</Tooltip>`.

    <Template
        data={{
          API_KEY: "YOUR_API_KEY",
          MIND_ID: "YOUR_MIND_ID",
          SIMULATION_MODEL: "mind-reasoner-pro"
        }}
        tooltips={{
          API_KEY:`<p>`Your secret API Key.`</p>`,
          MIND_ID: `<p>`The ID for your mind from Step 1.`</p>`,
          SIMULATION_MODEL: `<p>`The reasoning model to use for the simulation. 'mind-reasoner-pro' is our most advanced model. See docs for other options.`</p>`
        }}
      >
        `<CodeBlocks>`
          ``bash title="cURL"           curl -X POST https://app.mindreasoner.com/api/public/v1/simulate \             -H "Authorization: Bearer {{API_KEY}}" \             -H "Content-Type: application/json" \             -d '{                   "mindId": "{{MIND_ID}}",                   "selectedSimulationModel": "{{SIMULATION_MODEL}}",                   "scenario": {                     "message": "What would be your response to this customer complaint?"                   }                 }'           ``
          ```javascript title="Node.js"
          import axios from 'axios';

    const apiKey = '{{API_KEY}}';
          const url = 'https://app.mindreasoner.com/api/public/v1/simulate';

    const payload = {
            mindId: '{{MIND_ID}}',
            selectedSimulationModel: '{{SIMULATION_MODEL}}',
            scenario: {
              message: 'What would be your response to this customer complaint?'
            }
          };

    const runSimulation = async () => {
            try {
              const response = await axios.post(url, payload, {
                headers: {
                  'Authorization':`Bearer ${apiKey}`,
                  'Content-Type': 'application/json'
                }
              });
              console.log('Simulation result:');
              console.log(JSON.stringify(response.data, null, 2));
            } catch (error) {
              console.error('Error running simulation:', error.response.data);
            }
          };

    runSimulation();python title="Python"
          import requests
          import json

    api_key = '{{API_KEY}}'
          url = 'https://app.mindreasoner.com/api/public/v1/simulate'

    headers = {
              'Authorization': f'Bearer {api_key}',
              'Content-Type': 'application/json'
          }
          payload = {
              'mindId': '{{MIND_ID}}',
              'selectedSimulationModel': '{{SIMULATION_MODEL}}',
              'scenario': {
                  'message': 'What would be your response to this customer complaint?'
              }
          }

    response = requests.post(url, headers=headers, json=payload)

    print("Simulation result:")
          print(json.dumps(response.json(), indent=2))php title="PHP"
          <?php
          $apiKey = '{{API_KEY}}';
          $url = 'https://app.mindreasoner.com/api/public/v1/simulate';

    $data = [
              'mindId' => '{{MIND_ID}}',
              'selectedSimulationModel' => '{{SIMULATION_MODEL}}',
              'scenario' => [
                  'message' => 'What would be your response to this customer complaint?'
              ]
          ];$payload = json_encode($data);

    $ch = curl_init($url);
          curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
          curl_setopt($ch, CURLOPT_POST, true);
          curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
          curl_setopt($ch, CURLOPT_HTTPHEADER, [
              'Authorization: Bearer ' . $apiKey,
              'Content-Type: application/json'
          ]);

    $response = curl_exec($ch);
          curl_close($ch);

    echo "Simulation result:\n";$jsonResponse = json_decode($response, true);
          echo json_encode($jsonResponse, JSON_PRETTY_PRINT);
          ?>
          ruby title="Ruby"
          require 'uri'
          require 'net/http'
          require 'json'

    api_key = '{{API_KEY}}'
          url = URI("https://app.mindreasoner.com/api/public/v1/simulate")

    http = Net::HTTP.new(url.host, url.port)
          http.use_ssl = true

    request = Net::HTTP::Post.new(url)
          request["Authorization"] = "Bearer #{api_key}"
          request["Content-Type"] = "application/json"
          request.body = JSON.dump({
            "mindId" => "{{MIND_ID}}",
            "selectedSimulationModel" => "{{SIMULATION_MODEL}}",
            "scenario" => {
              "message" => "What would be your response to this customer complaint?"
            }
          })

    response = http.request(request)
          puts "Simulation result:"
          puts JSON.pretty_generate(JSON.parse(response.read_body))go title="Go"
          package main

    import (
          	"bytes"
          	"encoding/json"
          	"fmt"
          	"io"
          	"net/http"
          )

    func main() {
          	apiKey := "{{API_KEY}}"
          	url := "https://app.mindreasoner.com/api/public/v1/simulate"

    payload := map[string]interface{}{
          		"mindId": "{{MIND_ID}}",
          		"selectedSimulationModel": "{{SIMULATION_MODEL}}",
          		"scenario": map[string]string{
          			"message": "What would be your response to this customer complaint?",
          		},
          	}
          	jsonPayload, _ := json.Marshal(payload)

    req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonPayload))
          	req.Header.Set("Authorization", "Bearer "+apiKey)
          	req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
          	resp, err := client.Do(req)
          	if err != nil { panic(err) }
          	defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
          	fmt.Println("Simulation result:")
            var prettyJSON bytes.Buffer
            json.Indent(&prettyJSON, body, "", "  ")
            fmt.Println(string(prettyJSON.Bytes()))
          }
          ````</CodeBlocks>`
      `</Template>`

    The API will return the simulated response from the mind.

    ``json       {         "message": "Based on the provided data, my response to the customer complaint would be..."       }       ``
    `</Step>`
  `</Steps>`

  `<Success title="You're Ready to Build" icon="rocket">`
    Congratulations! You have successfully created a mind, uploaded data, and run your first simulation. You can now integrate this workflow to bring an accurate preview of how a person will think, feel, say, and act into your own applications.
  `</Success>`

<h2>Need Help?</h2>

<div className="highlight-cards">
    <div className="highlight-card">
      <div className="card-header">
        <span className="card-icon">📖</span>
        <h3>Full API Reference</h3>
      </div>
      <div className="card-content">
        <p className="card-description">Explore all endpoints and parameters in the official [API Documentation](https://docs.reasoner.com/mind-reasoner-api/api-reference).</p>
      </div>
    </div>
    <div className="highlight-card">
      <div className="card-header">
        <span className="card-icon">📧</span>
        <h3>Email Support</h3>
      </div>
      <div className="card-content">
        <p className="card-description">Contact us at support@mindreasoner.com for technical questions.</p>
      </div>
    </div>
  </div>
</div>
