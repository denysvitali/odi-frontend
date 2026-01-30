<script setup lang="ts">
import { computed } from 'vue'
import { QrCode, CreditCard, Copy, Check } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ref } from 'vue'
import type { Barcode } from '@/types/documents'

interface Props {
  barcode: Barcode
}

const props = defineProps<Props>()

const copied = ref(false)

const isQrBill = computed(() => !!props.barcode.qrBill)

const formatAmount = (amount?: number, currency?: string) => {
  if (amount === undefined) return null
  const curr = currency || 'CHF'
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: curr
  }).format(amount)
}

const formatIban = (iban?: string) => {
  if (!iban) return null
  // Format IBAN with spaces every 4 characters
  return iban.replace(/(.{4})/g, '$1 ').trim()
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <Card class="border-border/50">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <CardTitle class="text-sm font-medium flex items-center gap-2">
          <QrCode v-if="isQrBill" class="h-4 w-4" />
          <CreditCard v-else class="h-4 w-4" />
          {{ isQrBill ? 'QR Bill' : 'Barcode' }}
        </CardTitle>
        <Badge v-if="barcode.qrBill?.referenceType" variant="outline" class="text-xs">
          {{ barcode.qrBill.referenceType }}
        </Badge>
      </div>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- QR Bill Details -->
      <template v-if="barcode.qrBill">
        <!-- Amount -->
        <div v-if="barcode.qrBill.amount !== undefined" class="space-y-1">
          <p class="text-xs text-muted-foreground">Amount</p>
          <p class="text-2xl font-semibold">
            {{ formatAmount(barcode.qrBill.amount, barcode.qrBill.currency) }}
          </p>
        </div>

        <!-- IBAN -->
        <div v-if="barcode.qrBill.iban" class="space-y-1">
          <p class="text-xs text-muted-foreground">IBAN</p>
          <div class="flex items-center gap-2">
            <code class="text-sm bg-muted px-2 py-1 rounded font-mono">
              {{ formatIban(barcode.qrBill.iban) }}
            </code>
            <Button
              variant="ghost"
              size="icon"
              class="h-7 w-7"
              @click="copyToClipboard(barcode.qrBill.iban!)"
            >
              <Check v-if="copied" class="h-3 w-3 text-green-500" />
              <Copy v-else class="h-3 w-3" />
            </Button>
          </div>
        </div>

        <!-- Reference -->
        <div v-if="barcode.qrBill.reference" class="space-y-1">
          <p class="text-xs text-muted-foreground">Reference</p>
          <code class="text-sm bg-muted px-2 py-1 rounded font-mono block">
            {{ barcode.qrBill.reference }}
          </code>
        </div>

        <Separator v-if="barcode.qrBill.creditor || barcode.qrBill.debtor" />

        <!-- Creditor -->
        <div v-if="barcode.qrBill.creditor" class="space-y-1">
          <p class="text-xs text-muted-foreground">Creditor</p>
          <div class="text-sm">
            <p v-if="barcode.qrBill.creditor.name" class="font-medium">
              {{ barcode.qrBill.creditor.name }}
            </p>
            <p v-if="barcode.qrBill.creditor.address" class="text-muted-foreground">
              {{ barcode.qrBill.creditor.address }}
            </p>
            <p v-if="barcode.qrBill.creditor.postalCode || barcode.qrBill.creditor.city" class="text-muted-foreground">
              {{ barcode.qrBill.creditor.postalCode }} {{ barcode.qrBill.creditor.city }}
            </p>
          </div>
        </div>

        <!-- Debtor -->
        <div v-if="barcode.qrBill.debtor" class="space-y-1">
          <p class="text-xs text-muted-foreground">Debtor</p>
          <div class="text-sm">
            <p v-if="barcode.qrBill.debtor.name" class="font-medium">
              {{ barcode.qrBill.debtor.name }}
            </p>
            <p v-if="barcode.qrBill.debtor.address" class="text-muted-foreground">
              {{ barcode.qrBill.debtor.address }}
            </p>
            <p v-if="barcode.qrBill.debtor.postalCode || barcode.qrBill.debtor.city" class="text-muted-foreground">
              {{ barcode.qrBill.debtor.postalCode }} {{ barcode.qrBill.debtor.city }}
            </p>
          </div>
        </div>

        <!-- Additional Information -->
        <div v-if="barcode.qrBill.additionalInformation" class="space-y-1">
          <p class="text-xs text-muted-foreground">Additional Information</p>
          <p class="text-sm">{{ barcode.qrBill.additionalInformation }}</p>
        </div>
      </template>

      <!-- Raw Barcode Text -->
      <template v-else>
        <div class="space-y-1">
          <p class="text-xs text-muted-foreground">Content</p>
          <code class="text-sm bg-muted px-2 py-1 rounded font-mono block break-all">
            {{ barcode.text }}
          </code>
        </div>
      </template>
    </CardContent>
  </Card>
</template>
