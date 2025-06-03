/**
 * Utilitários para formatação e validação de dados
 */

/**
 * Formata um CPF enquanto o usuário digita
 * @param {string} texto - O texto a ser formatado como CPF
 * @returns {string} - CPF formatado
 */
export const formatarCpf = (texto) => {
  // Remove caracteres não numéricos
  const cpfLimpo = texto.replace(/\D/g, '');
  
  if (cpfLimpo.length <= 11) {
    let cpfFormatado = cpfLimpo;
    
    if (cpfLimpo.length > 3) {
      cpfFormatado = cpfLimpo.replace(/^(\d{3})(\d)/, '$1.$2');
    }
    if (cpfLimpo.length > 6) {
      cpfFormatado = cpfFormatado.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (cpfLimpo.length > 9) {
      cpfFormatado = cpfFormatado.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    }
    
    return cpfFormatado;
  }
  
  return texto;
};

/**
 * Formata um telefone enquanto o usuário digita
 * @param {string} texto - O texto a ser formatado como telefone
 * @returns {string} - Telefone formatado
 */
export const formatarTelefone = (texto) => {
  const telefoneLimpo = texto.replace(/\D/g, '');
  
  if (telefoneLimpo.length <= 11) {
    let telefoneFormatado = telefoneLimpo;
    
    if (telefoneLimpo.length > 2) {
      telefoneFormatado = telefoneLimpo.replace(/^(\d{2})(\d)/, '($1) $2');
    }
    if (telefoneLimpo.length > 6) {
      telefoneFormatado = telefoneFormatado.replace(/^(\(\d{2}\)\s)(\d{4,5})(\d)/, '$1$2-$3');
    }
    
    return telefoneFormatado;
  }
  
  return texto;
};

/**
 * Busca endereço pelo CEP usando a API ViaCEP
 * @param {string} cep - CEP a ser consultado
 * @returns {Promise<Object>} - Dados do endereço
 */
export const buscarEnderecoPorCep = async (cep) => {
  const cepLimpo = cep.replace(/\D/g, '');
  
  if (cepLimpo.length !== 8) {
    throw new Error('CEP deve conter 8 dígitos');
  }
  
  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  const data = await response.json();
  
  if (data.erro) {
    throw new Error('CEP não encontrado');
  }
  
  return {
    endereco: data.logradouro,
    bairro: data.bairro,
    cidade: data.localidade,
    estado: data.uf
  };
};
