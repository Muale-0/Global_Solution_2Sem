import { LinkBotao } from '../../components/Botao/Botao';
import PerguntaFaq from '../../components/PerguntaFaq/PerguntaFaq';
import Revelar from '../../components/Revelar/Revelar';
import TituloPagina from '../../components/TituloPagina/TituloPagina';
import { gruposFaq } from '../../dados/faq';

export default function Faq() {
  return (
    <>
      <TituloPagina
        sobretitulo="Ajuda"
        titulo="Perguntas frequentes"
        descricao="Toque em uma pergunta para ver a resposta."
      />

      <div className="space-y-10">
        {gruposFaq.map((grupo) => (
          // Cada grupo de perguntas surge quando entra na tela.
          <Revelar key={grupo.titulo}>
            <section>
              <h2 className="text-xl font-bold md:text-2xl">{grupo.titulo}</h2>
              <div className="mt-4 space-y-3">
                {grupo.itens.map((item) => (
                  <PerguntaFaq
                    key={item.pergunta}
                    pergunta={item.pergunta}
                    resposta={item.resposta}
                  />
                ))}
              </div>
            </section>
          </Revelar>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-marca-50 p-6 text-center">
        <p className="text-lg font-semibold text-marca-900">
          Não encontrou o que procurava?
        </p>
        <LinkBotao to="/contato" className="mt-4">
          Falar com a equipe
        </LinkBotao>
      </div>
    </>
  );
}
