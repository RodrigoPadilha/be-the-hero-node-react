const connection = require('../database/connection')

module.exports = {

    async index (request, response){
        const { page = 1} = request.query;        

        const [qtdRegisters] = await connection('incidents').count() // qtdRegisters[0]
        console.log(qtdRegisters)   // Imprime --> { 'count(*)': 18 }       count é fixo

        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')           // junção para trazer dados da tabela ONG com relacionamento ongs.id = incident.ong_id
            .limit(5)
            .offset((page -1 ) * 5)     // Pula 5 registros por página. Pega a partir de ...      Primeira página -> 1-1=0 ... 0*5=0 Pega a partir do registo ZERO             Segunda página -> 2-1=1 ... 1*5=5  Pega a partir do registro 5
            .select([                   // Retona todos os dados da tabela incidents, porém apenas alguns específicos da tabela
                'incidents.*',
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ])      
        
        // Retorna o total de registros no cabeçaljo da requisição de resposta
        response.header('X-Total-Count', qtdRegisters['count(*)'])

        return response.json({ incidents })
    },
    
    async create(request, response){
        const ong_id = request.headers.authorization;
        const { title, description, value, ond_id } = request.body;

        //const id = result[0]        
        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });
        
        return response.json({ id });        
    },

    async delete(request, response){
        const { id } = request.params;
        const ong_id = request.headers.authorization;
        
        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if(incident.ong_id != ong_id){
            return response.status(401).json({error: 'Operation not permited.'});     // operação não autorizada
        }

        // incident.delet() Isso não pode???
        await connection('incidents').where('id',id).delete();

        return response.status(204).send(); //  Resposta com Sucesso e sem conteúdo
    }

};