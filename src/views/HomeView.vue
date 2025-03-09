<script lang="ts" setup>
import {ref, watch} from 'vue';

import type { Document, SearchResult } from '@/types/documents';

const error = ref<string>("");
const currentDocuments = ref<Document[]>([
  {
    _id: "e1867d8f-bd48-4d1c-8ebe-3c3c4aa3016a_10",
    _source: {
      text: "This is a test document",
      company: {
        name: "Test Company"
      }
    },
    "highlight": {
      "text": [
        "This is a <em>test</em> document"
      ]
    }
  },
  {
    _id: "e1867d8f-bd48-4d1c-8ebe-3c3c4aa3016a_10",
    _source: {
      text: "This is a test document",
      company: {
        name: "Test Company"
      }
    },
    "highlight": {
      "text": [
        "This is a <em>test</em> document"
      ]
    }
  }
]);
const documents = ref<Document[]>([]);
const searchTerm = ref<string>('');
const BASE_URL = window._settings.apiUrl;
const OPENSEARCH_URL = window._settings.opensearchUrl;
const resultsFound = ref<number>(0);
const loading = ref<boolean>(false);

const documentPath = (documentId: string): string => {
  return documentId.split('_').join('/');
}

const openDocument = (documentId: string) => {
  window.open(`${BASE_URL}/files/${documentPath(documentId)}`, '_blank');
}

const openOpensearchDocument = (documentId: string) => {
  window.open(`${OPENSEARCH_URL}${documentId}`, '_blank');
}

const doSearch = async (term: string) => {
  loading.value = true;
  let req = new Request(`${BASE_URL}/search`, {
    method: 'POST',
    body: JSON.stringify({
      searchTerm: term,
    }),
  });

  try {
    let res = await fetch(req);
    if (res.status != 200) {
      error.value = res.statusText;
      return
    }

    error.value = ''

    let json = await res.json() as SearchResult<Document>;
    resultsFound.value = json.hits?.total.value || 0;
    currentDocuments.value = json.hits!!.hits;
  } catch (err) {
    currentDocuments.value = documents.value;
    console.error(err);
  } finally {
    loading.value = false;
  }
}

const handleKeypress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    doSearch(searchTerm.value);
  }
}

watch(searchTerm, async (newValue, oldValue) => {
  if (newValue.length < 3) {
    return
  }
});
</script>

<template>
  <div class="document-list">
    <div class="search-container">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on">
            mdi-help-circle
          </v-icon>
        </template>
        <span>Enter a search term to find documents.</span>
      </v-tooltip>
      <v-text-field
          v-model="searchTerm"
          @keydown="handleKeypress"
          label="Query"
          clearable
      >
        <template v-slot:append-outer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">
                mdi-help-circle
              </v-icon>
            </template>
            <span>Enter a search term to find documents.</span>
          </v-tooltip>
        </template>
      </v-text-field>
    </div>
    <p class="error" v-if="error != ''">
      {{ error }}
    </p>
    <p>{{ resultsFound }} results</p>
    <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
    ></v-progress-circular>
    <div class="document-container">
      <v-card
          v-for="document in currentDocuments"
          :key="document._id"
          class="document"
          max-width="500"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <img
                alt="Document thumbnail"
                class="document-thumbnail"
                :src="BASE_URL + '/files/' + documentPath(document._id)"
                @click="openDocument(document._id)"
                height="600"
                v-bind="attrs"
                v-on="on"
            />
          </template>
          <span>Click to open the document.</span>
        </v-tooltip>
        <v-card-title>{{ document._source.company?.name }}</v-card-title>
        <v-card-text
            v-for="highlight in document.highlight?.text"
            :key="highlight"
            class="highlighted"
            v-html="highlight"
        >
        </v-card-text>
        <v-card-text>{{ document._source.text.substring(0, 200) }}</v-card-text>
        <v-card-actions>
          <v-btn
              prepend-icon="mdi-file-document"
              @click="openOpensearchDocument(document._id)"
          >View in OpenSearch
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.document-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
}

.document-thumbnail {
  cursor: pointer;
}

.search-container {
  width: 100%;
  display: flex;
  justify-content: center;

  input {
    padding: 10px;
    min-width: 50vw;
  }
}

.document-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1rem;
}

.document {
  color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  img.thumbnail {
    cursor: pointer;
    width: 100%;
    height: 500px;
    object-fit: contain;
  }

  div.company-name {
    font-weight: bold;
  }

  .ocr-text {
    display: block;
    overflow: hidden;
    text-align: left;
    height: 6rem;
    width: 100%;
    text-overflow: ellipsis;
  }
}
</style>

<style lang="scss">
.highlighted {
  em {
    background-color: #ffee6a;
  }
}
</style>
