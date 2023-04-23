var container = document.createElement('div');
document.body.appendChild(container);

async function req_info(){
  let url = 'https://api.covid19api.com/country/brazil';
  let dados = await fetch(url);
  if(dados.status == 200){
    dados = dados.json();
    return dados;
  }
}

async function get_info(){
    var result = await req_info();
    if(result){
      var dados = [];
      dados.push(['Categoria','Mortes']);
      for(let i = 0; i < result.length; i++){
        dados.push([change_date_to_br(result[i].Date), result[i].Deaths]);
      }
      criarGrafico(dados);
    }else{
      console.log('Erro na busca dos dados!', result);
    }
}

function criarGrafico(dados) {
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(function() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Categoria');
    for (var i = 0; i < dados[0].length - 1; i++) {
      data.addColumn('number', dados[0][i+1]);
    }
    data.addRows(dados.slice(1));
    
    var options = {
      title: 'Mortes pela COVID no Brasil',
      width: window.innerWidth,
      height: window.innerHeight,
      legend: { position: 'top' },
      colors: ['red'],
      hAxis: {
        textPosition: 'none'
      },
      backgroundColor: 'black',
      titleTextStyle: { color: 'white' }, 
      legendTextStyle: { color: 'white' }, 
      hAxisTextStyle: { color: 'white' },
      vAxisTextStyle: { color: 'white' }
    };
    var chart = new google.visualization.LineChart(container);
    chart.draw(data, options);
  });
}

function change_date_to_br(data) {
  var data = new Date(data); 
  var dia = data.getUTCDate().toString().padStart(2, '0'); 
  var mes = (data.getUTCMonth() + 1).toString().padStart(2, '0'); 
  var ano = data.getUTCFullYear().toString();
  var final = dia + '/' + mes + '/' + ano;
  return final;
}

get_info();