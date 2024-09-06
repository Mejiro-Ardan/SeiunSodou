<script setup>
import { parseMarkdown } from 'seiunsodou_mdc/runtime'

const props = defineProps({
    text: {
        type: String,
        required: true
    }
});

const { data: ast } = await useAsyncData('markdown', () => parseMarkdown(props.text.replaceAll('\\n', '\n')));

</script>
<template>
    <MDCRenderer :body="ast.body" :data="ast.data" tag="article" />
</template>