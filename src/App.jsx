import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css'

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editandoId) {
        await axios.put(`http://localhost:3000/usuarios/${editandoId}`, { nome });
        setEditandoId(null);
      } else {
        await axios.post('http://localhost:3000/usuarios', { nome });
      }
      setNome('');
      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleEditar = (usuario) => {
    setNome(usuario.nome);
    setEditandoId(usuario.id);
  };

  const handleDeletar = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/usuarios/${id}`);
      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  return (
    <div id='mainapp'>
      <div>
      <h1>Lista de Usuários</h1>
      <ul>
        {usuarios.map(usuario => (
          <li key={usuario.id}>
            {usuario.nome} (ID: {usuario.id}){' '}
            <button onClick={() => handleEditar(usuario)}>Editar</button>{' '}
            <button onClick={() => handleDeletar(usuario.id)}>Deletar</button>
          </li>
        ))}
      </ul>

      <h2>{editandoId ? 'Editar Usuário' : 'Criar Usuário'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome do usuário"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <button type="submit">{editandoId ? 'Atualizar' : 'Criar'}</button>
        {editandoId && <button onClick={() => { setEditandoId(null); setNome(''); }}>Cancelar</button>}
      </form>
      </div>
    </div>
  );
}

export default App;
