import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useFirmaStore = defineStore('firma', () => {
    // State
    const firmalar = ref([])
    const total = ref(0)
    const page = ref(1)
    const limit = ref(20)
    const totalPages = ref(0)
    const loading = ref(false)
    const search = ref('')
    const selectedTeknokent = ref('')
    const sortBy = ref('date')
    const stats = ref(null)
    const statsLoading = ref(false)
    const teknokentler = ref([])

    // Actions
    async function fetchFirmalar() {
        loading.value = true
        try {
            const params = {
                page: page.value,
                limit: limit.value,
                sort: sortBy.value
            }
            if (search.value) params.search = search.value
            if (selectedTeknokent.value) params.teknokent = selectedTeknokent.value

            const { data } = await axios.get('/api/firmalar', { params })
            if (data.success) {
                firmalar.value = data.firmalar
                total.value = data.total
                totalPages.value = data.totalPages
            }
        } catch (err) {
            console.error('Firmalar yüklenemedi:', err)
        } finally {
            loading.value = false
        }
    }

    async function fetchStats() {
        statsLoading.value = true
        try {
            const { data } = await axios.get('/api/stats')
            if (data.success) {
                stats.value = data.data
            }
        } catch (err) {
            console.error('İstatistikler yüklenemedi:', err)
        } finally {
            statsLoading.value = false
        }
    }

    async function fetchTeknokentler() {
        try {
            const { data } = await axios.get('/api/teknokentler')
            if (data.success) {
                teknokentler.value = data.data
            }
        } catch (err) {
            console.error('Teknokentler yüklenemedi:', err)
        }
    }

    async function exportExcel() {
        try {
            const params = {}
            if (selectedTeknokent.value) params.teknokent = selectedTeknokent.value

            const response = await axios.get('/api/export/excel', {
                responseType: 'blob',
                params
            })

            // Dosyayı indir
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `teknokent_firmalar_${new Date().toISOString().slice(0, 10)}.xlsx`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            return true
        } catch (err) {
            console.error('Excel export hatası:', err)
            return false
        }
    }

    function setPage(p) {
        page.value = p
        fetchFirmalar()
    }

    function setSearch(s) {
        search.value = s
        page.value = 1
        fetchFirmalar()
    }

    function setTeknokentFilter(t) {
        selectedTeknokent.value = t
        page.value = 1
        fetchFirmalar()
    }

    function setSort(s) {
        sortBy.value = s
        fetchFirmalar()
    }

    return {
        firmalar,
        total,
        page,
        limit,
        totalPages,
        loading,
        search,
        selectedTeknokent,
        sortBy,
        stats,
        statsLoading,
        teknokentler,
        fetchFirmalar,
        fetchStats,
        fetchTeknokentler,
        exportExcel,
        setPage,
        setSearch,
        setTeknokentFilter,
        setSort
    }
})
