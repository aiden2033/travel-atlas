import json
import re
from html.parser import HTMLParser
from pathlib import Path


class Node:
    def __init__(self, tag='', attrs=()):
        self.tag = tag
        self.attrs = dict(attrs)
        self.children = []

    def text(self):
        return ' '.join(''.join(x.text() if isinstance(x, Node) else x for x in self.children).split())

    def find(self, predicate):
        result = [self] if predicate(self) else []
        for child in self.children:
            if isinstance(child, Node):
                result.extend(child.find(predicate))
        return result


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.root = Node()
        self.stack = [self.root]
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in {'img', 'br', 'meta', 'link', 'input', 'hr', 'source', 'wbr'}:
            self.stack.append(node)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                self.stack = self.stack[:index]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def has_class(name):
    return lambda node: name in node.attrs.get('class', '').split()


def field(node, name):
    matches = node.find(has_class(name))
    return matches[0].text() if matches else ''


def clean(value):
    return re.sub(r'^[^\wА-Яа-яЁё«]+', '', value).strip()


def tags_for(name, section):
    tags = []
    for pattern, tag in [
        (r'пляж|beach|ченанг|tengah|rhu|tengkorak', 'beach'),
        (r'еда|рынок|чайнатаун|индия', 'food'),
        (r'храм|temple|пещеры бату', 'temple-shrine'),
        (r'парк|водопад|гора|хайленд|остров|пещера|сад|хилл|bridge', 'nature'),
        (r'башн|tower|bridge|хилл|гора', 'view'),
        (r'бар|ночн', 'nightlife'),
        (r'шоп|плаза|рынок|торгов', 'shopping'),
    ]:
        if re.search(pattern, name, re.I):
            tags.append(tag)
    if section == 'kl-nearest':
        tags.append('day-trip')
    if not tags:
        tags = ['sight', 'walk']
    return list(dict.fromkeys(tags))


root = Path(__file__).resolve().parents[1]
document = Document((root / 'docs/archive/winter26.html').read_text()).root
cities = {}
for city in ['langkawi', 'penang', 'kuala-lumpur']:
    block = document.find(lambda n: n.attrs.get('id') == city)[0]
    places = []
    nearby = block.find(lambda n: n.attrs.get('id') == 'kl-nearest')
    day_trips = nearby[0].find(has_class('location-item')) if nearby else []
    for index, item in enumerate(block.find(has_class('location-item'))):
        name = clean(field(item, 'location-name'))
        images = item.find(lambda n: n.tag == 'img')
        section = 'kl-nearest' if item in day_trips else ''
        places.append({
            'slug': f'{city}-{index + 1}', 'nameRu': name, 'nameEn': name,
            'city': city, 'description': field(item, 'location-details'),
            'tags': tags_for(name, section), 'timeEstimateHours': [1, 2],
            'mapsQuery': f'{name}, {city}, Malaysia',
            'remotePhoto': images[0].attrs.get('src', '') if images else '',
            'source': 'winter26',
        })
    cities[city] = places
notes = {}
for country in ['malaysia', 'indonesia']:
    block = document.find(lambda n: n.attrs.get('id') == country)[0]
    notes[country] = [n.text() for n in block.find(lambda n: has_class('route-card')(n) or has_class('highlight')(n))]
(root / 'src/atlas/winter.json').write_text(json.dumps({'cities': cities, 'notes': notes}, ensure_ascii=False, indent=2) + '\n')
print({city: len(places) for city, places in cities.items()})
