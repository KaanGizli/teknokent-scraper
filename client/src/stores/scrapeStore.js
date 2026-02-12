import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useScrapeStore = defineStore('scrape', () => {
    const status = ref('idle') // idle, running, completed, error
    const current = ref(0)
    const total = ref(0)
    const message = ref('')
    const teknokentName = ref('')
    const pollInterval = ref(null)
    const history = ref([])

    // Toasts
    const toasts = ref([])
    let toastId = 0

    function addToast(text, type = 'info') {
        const id = ++toastId
        toasts.value.push({ id, text, type })
        setTimeout(() => {
            toasts.value = toasts.value.filter(t => t.id !== id)
        }, 4000)
    }

    async function startScrape(teknokentId) {
        try {
            const { data } = await axios.post(`/api/scrape/${teknokentId}`)
            if (data.success) {
                status.value = 'running'
                message.value = 'Scraping başlatıldı...'
                teknokentName.value = data.message
                addToast(`🚀 ${data.message}`, 'success')
                startPolling()
            }
        } catch (err) {
            if (err.response?.status === 409) {
                addToast(err.response.data.error, 'warning')
            } else {
                addToast('Scraping başlatılamadı!', 'error')
            }
        }
    }

    function startPolling() {
        if (pollInterval.value) clearInterval(pollInterval.value)
        pollInterval.value = setInterval(checkStatus, 1000)
    }

    function stopPolling() {
        if (pollInterval.value) {
            clearInterval(pollInterval.value)
            pollInterval.value = null
        }
    }

    async function checkStatus() {
        try {
            const { data } = await axios.get('/api/scrape/status')
            if (data.success && data.data) {
                const s = data.data
                status.value = s.status
                current.value = s.current || 0
                total.value = s.total || 0
                message.value = s.message || ''

                if (s.status === 'completed') {
                    stopPolling()
                    addToast(`✅ ${s.message}`, 'success')
                } else if (s.status === 'error') {
                    stopPolling()
                    addToast(`❌ ${s.message}`, 'error')
                } else if (s.status === 'idle') {
                    stopPolling()
                }
            }
        } catch (err) {
            console.error('Status check failed:', err)
        }
    }

    async function fetchHistory() {
        try {
            const { data } = await axios.get('/api/scrape/history')
            if (data.success) {
                history.value = data.data
            }
        } catch (err) {
            console.error('History yüklenemedi:', err)
        }
    }

    function removeToast(id) {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    return {
        status,
        current,
        total,
        message,
        teknokentName,
        history,
        toasts,
        startScrape,
        checkStatus,
        fetchHistory,
        addToast,
        removeToast,
        stopPolling
    }
})
