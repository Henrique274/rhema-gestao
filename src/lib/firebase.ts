
// NOTA: Este arquivo contém apenas a estrutura simulada do Firebase
// O usuário deverá conectar seu próprio Firebase/Firestore após o desenvolvimento

// Simulação básica de funcionalidades Firebase
export class FirebaseSimulation {
  // Simulação básica de coleções
  private collections: Record<string, any[]> = {
    members: [],
    attendance: [],
    services: [
      { id: "quarta", name: "Culto de Quarta" },
      { id: "sexta", name: "Culto de Sexta" },
      { id: "domingo", name: "Culto de Domingo" }
    ]
  };

  // Obter todos os documentos de uma coleção
  async getAll(collection: string) {
    return this.collections[collection] || [];
  }

  // Adicionar um documento
  async add(collection: string, data: any) {
    const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newDoc = { id, ...data };
    if (!this.collections[collection]) {
      this.collections[collection] = [];
    }
    this.collections[collection].push(newDoc);
    return { id };
  }

  // Atualizar um documento
  async update(collection: string, id: string, data: any) {
    const collectionData = this.collections[collection] || [];
    const index = collectionData.findIndex(item => item.id === id);
    if (index >= 0) {
      collectionData[index] = { ...collectionData[index], ...data };
    }
    return { updated: index >= 0 };
  }

  // Excluir um documento
  async delete(collection: string, id: string) {
    const collectionData = this.collections[collection] || [];
    this.collections[collection] = collectionData.filter(item => item.id !== id);
    return { deleted: true };
  }

  // Buscar por critérios
  async query(collection: string, field: string, value: any) {
    const collectionData = this.collections[collection] || [];
    return collectionData.filter(item => {
      if (typeof item[field] === 'string' && typeof value === 'string') {
        return item[field].toLowerCase().includes(value.toLowerCase());
      }
      return item[field] === value;
    });
  }
}

// Instância para ser usada pela aplicação
export const firebaseDB = new FirebaseSimulation();
