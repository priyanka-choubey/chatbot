import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatBot, { Loading } from 'react-simple-chatbot';

class DBPedia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: '',
      trigger: false,
    };

    this.triggetNext = this.triggetNext.bind(this);
  }

  componentWillMount() {
    const self = this;
    const { steps } = this.props;// eslint-disable-next-line
    const search = steps.search.value;
    const endpoint = encodeURI('htttps://iiita.ac.in');
    //const query = encodeURI(`
    //  select * where {
    //  ?x rdfs:label "${search}"@en .
    //  ?x rdfs:comment ?comment .
    //  FILTER (lang(?comment) = 'en')
    //  } LIMIT 100
    //`);

    const queryUrl = `https://iiita.ac.in/sparql/?default-graph-uri=${endpoint}&format=json`;

    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', readyStateChange);

    function readyStateChange() {
      if (this.readyState === 4) {
        const data = JSON.parse(this.responseText);
        const bindings = data.results.bindings;
        if (bindings && bindings.length > 0) {
          self.setState({ loading: false, result: bindings[0].comment.value });
        } else {
          self.setState({ loading: false, result: 'Not found.' });
        }
      }
    }

    xhr.open('GET', queryUrl);
    xhr.send();
  }

  triggetNext() {
    this.setState({ trigger: true }, () => {
      this.props.triggerNextStep();
    });
  }

  render() {
    const { trigger, loading, result } = this.state;

    return (
      <div className="dbpedia">
        { loading ? <Loading /> : result }
        {
          !loading &&
          <div
            style={{
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            {
              !trigger &&
              <button
                onClick={() => this.triggetNext()}
              >
                Search Again
              </button>
            }
          </div>
        }
      </div>
    );
  }
}

class QuoraAns extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: '',
      trigger: false,
    };

    this.triggetNext = this.triggetNext.bind(this);
  }

  componentWillMount() {
    const self = this;
    const { steps } = this.props;// eslint-disable-next-line
    const search = steps.search.value;
    const endpoint = encodeURI('https://www.quora.com/How-do-you-book-a-visitor-hostel-at-IIIT-Allahabad');
  /*  const query = encodeURI(`
      select * where {
      ?x rdfs:label "${search}"@en .
      ?x rdfs:comment ?comment .
      FILTER (lang(?comment) = 'en')
      } LIMIT 100
    `);*/

    const queryUrl = `https://www.quora.com/How-do-you-book-a-visitor-hostel-at-IIIT-Allahabad/sparql/?default-graph-uri=${endpoint}&format=json`;

    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', readyStateChange);

    function readyStateChange() {
      if (this.readyState === 4) {
        const data = JSON.parse(this.responseText);
        const bindings = data.results.bindings;
        if (bindings && bindings.length > 0) {
          self.setState({ loading: false, result: bindings[0].comment.value });
        } else {
          self.setState({ loading: false, result: 'Not found.' });
        }
      }
    }

    xhr.open('GET', queryUrl);
    xhr.send();
  }

  triggetNext() {
    this.setState({ trigger: true }, () => {
      this.props.triggerNextStep();
    });
  }

  render() {
    const { trigger, loading, result } = this.state;

    return (
      <div className="quora_ans">
        { loading ? <Loading /> : result }
        {
          !loading &&
          <div
            style={{
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            {
              !trigger &&
              <button
                onClick={() => this.triggetNext()}
              >
                Search Again
              </button>
            }
          </div>
        }
      </div>
    );
  }
}

DBPedia.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
};

QuoraAns.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
};

DBPedia.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
};

QuoraAns.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
};

const chatbot = () => (
  <ChatBot
  steps={[
    {
      id: 'greetings',
      message: 'Greetings!',
      end: true,
    },
    {
      id: '1',
      message: 'Are you a member of IIITA community or an outsider?',
      trigger: '2',
    },
    {
      id: '2',
      options: [
        {value: 1, label: 'outsider',trigger: '1*'},
        {value: 2, label: 'member',trigger: '1#'},
      ],
    },
    {
       id: '1*',
       message: 'Welcome to IIITA.What do you need help with?',
       trigger: '2*',
     },
     {
       id: '2*',
       options: [
         { value: 1, label: 'Accommodation', trigger: '3*' },
         { value: 2, label: 'Infrastructure', trigger: '4*' },
         { value: 3, label: 'Information', trigger: '5*' },
       ],
     },
     {
       id: '3*',
       message: "We have a Visitor's hostel that you could stay in. ",
       trigger: '9*',
     },
     {
       id: '6*',
       message: 'Anything else you need help with?',
       trigger: '7*',
     },
     {
       id: '7*',
       options:[
         {value: 1, label: 'Yes,Please', trigger:'2*'},
         {value: 2, label: "No,That'd be all", trigger: "8*" },
       ],
     },
     {
       id: '8*',
       message: 'Hope we were helpful.',
       end: true,
     },
     {
       id: '9*',
       options:[
         {value: 1, label: 'know more', component: <DBPedia />, waitaction: true, trigger: '6*'},
         {value: 2, label: 'book a room', component: <QuoraAns />, waitaction: true, trigger: '6*',},
         {value: 3, label: 'leave discussion', trigger: '8*'},
       ],
     },
     {
       id: '4*',
       message: 'You chose infrastructure',
       end: true,
     },
     {
       id: '5*',
       message: 'You chose Information',
       end: true,
     },
     {
       id: '1#',
       message: 'hello',
       end: true,
     },
  ]}
/>
)

export default chatbot;
