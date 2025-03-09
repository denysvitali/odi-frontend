<script lang="ts" setup>
import {ref, watch} from 'vue';

import type { Document, SearchResult } from '@/types/documents';
import { onMounted } from 'vue';
import { onUnmounted } from 'vue';

const error = ref<string>("");
const currentDocuments = ref<Document[]>([]);
const documents = ref<Document[]>([]);
const BASE_URL = window._settings.apiUrl;
const OPENSEARCH_URL = window._settings.opensearchUrl;
const loading = ref<boolean>(false);

let scrollId: String | null = null;

const documentPath = (documentId: string): string => {
  return documentId.split('_').join('/');
}

const openDocument = (documentId: string) => {
  window.open(`${BASE_URL}/files/${documentPath(documentId)}`, '_blank');
}

const openOpensearchDocument = (documentId: string) => {
  window.open(`${OPENSEARCH_URL}${documentId}`, '_blank');
}

const loadDocuments = async () => {
  loading.value = true;
  let url = `${BASE_URL}/documents`;
  if(scrollId != null) {
    url += `?scroll_id=${scrollId}`;
  }
  let req = await fetch(url);
  if (!req.ok) {
    error.value = "Failed to load documents";
    return;
  }
  const data: SearchResult<Document> = await req.json();
  if(data.hits == undefined) {
    error.value = "No documents found";
    return;
  }
  documents.value.push(...data.hits.hits);
  if(data._scroll_id != undefined){
    scrollId = data._scroll_id;
  }
  loading.value = false;
}

const handleScroll = () => {
  // If we've reached the bottom, load more documents
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    console.log("Reached bottom");
    loadDocuments();
  }
}

onMounted(() => {
  addEventListener('scroll', handleScroll);
  loadDocuments();
});

onUnmounted(() => {
  removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <h2>Last indexed documents</h2>
  <div class="document-list">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon v-bind="attrs" v-on="on">
          mdi-help-circle
        </v-icon>
      </template>
      <span>This section displays the last indexed documents.</span>
    </v-tooltip>
    <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
    ></v-progress-circular>
    <div class="document-container">
      <v-card
          v-for="document in documents"
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
