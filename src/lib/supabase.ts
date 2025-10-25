import { createClient } from '@supabase/supabase-js'
import { UserProfile, VisionTestSession, PaymentData } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Funções para gerenciar usuários
export async function saveUserProfile(profile: UserProfile) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profile])
      .select()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao salvar perfil:', error)
    return { success: false, error }
  }
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return { success: false, error }
  }
}

// Funções para gerenciar sessões de teste
export async function saveTestSession(session: VisionTestSession) {
  try {
    const { data, error } = await supabase
      .from('test_sessions')
      .insert([session])
      .select()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao salvar sessão:', error)
    return { success: false, error }
  }
}

export async function getTestSessions(userId: string) {
  try {
    const { data, error } = await supabase
      .from('test_sessions')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao buscar sessões:', error)
    return { success: false, error }
  }
}

// Funções para gerenciar pagamentos
export async function savePayment(payment: PaymentData) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([payment])
      .select()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao salvar pagamento:', error)
    return { success: false, error }
  }
}

export async function updatePaymentStatus(paymentId: string, status: 'completed' | 'failed') {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', paymentId)
      .select()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error)
    return { success: false, error }
  }
}

// Função para enviar webhook
export async function sendWebhook(payload: any, webhookUrl: string = 'https://webhook.site/your-endpoint') {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return { success: true, data: await response.json() }
  } catch (error) {
    console.error('Erro ao enviar webhook:', error)
    return { success: false, error }
  }
}

// Inicializar tabelas (executar uma vez)
export async function initializeTables() {
  try {
    // Criar tabela de perfis de usuário
    await supabase.rpc('create_user_profiles_table')
    
    // Criar tabela de sessões de teste
    await supabase.rpc('create_test_sessions_table')
    
    // Criar tabela de pagamentos
    await supabase.rpc('create_payments_table')
    
    console.log('Tabelas inicializadas com sucesso')
  } catch (error) {
    console.error('Erro ao inicializar tabelas:', error)
  }
}