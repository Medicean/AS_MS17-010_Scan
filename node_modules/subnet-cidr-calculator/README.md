# subnet-cidr-adviser
=================

JavaScript class for calculating all possible subnets, subnet validity, ip range



What does it do?
----------------

* Calculates all possible subnets within the given vpc.

* Calculates IP range available within each of the subnet.

* Calculates if subnet you are trying to create is already taken or overlapping with existing subnet (you need to provide a list of existing subnets).

* Suggest next possible subnet  (you need to provide a list of existing subnets).

* Takes a Subnet CIDR network address and returns information ( all hosts, start address, end address)

Download
-------

* [npm](https://www.npmjs.com/package/subnet-cidr-calculator)

Demo
-------

* [demo](http://pratik-github.github.io/subnet-cidr-adviser/)

Support
-------

* Node.js
* ... in progress

Installation
------------

```sh
> bower install subnet-cidr-calculator

> npm install subnet-cidr-calculator
```


Node.js
-------

```javascript
var SubnetCIDRAdviser = require( 'subnet-cidr-calculator' );

var existingSubnetCIDR = ['10.0.32.0/19'];
var probabal_subnets = SubnetCIDRAdviser.calculate('10.0.0.0' , '16', existingSubnetCIDR);
var is_overlap = SubnetCIDRAdviser.isSubnetOverlap(existingSubnetCIDR, '10.0.32.0/20');
console.log(is_overlap, 'subnetOverlap');
var ip_range = SubnetCIDRAdviser.getIpRangeForSubnet( '10.0.32.0/20' );
console.log('IP range for 10.0.32.0/20 is', ip_range);

var subnetdetails = SubnetCIDRAdviser.getSubnetDetails( '10.0.32.0/20' );
console.log('Details for 10.0.32.0/20 is', subnetdetails);

var parentVPC_CIDR = '10.0.0.0/16';
var cidrToValidate = '';
var getNextValidCIDR = SubnetCIDRAdviser.getNextValidCIDR( parentVPC_CIDR, existingSubnetCIDR, probabal_subnets, cidrToValidate );
console.log('getNextValidCIDR is', getNextValidCIDR);
```


RequireJS
---------

```javascript
require( [ 'ip-subnet-calculator' ],

function( SubnetCIDRAdviser )
{
   console.log( SubnetCIDRAdviser.calculate( '10.0.0.0', '16', existingSubnetCIDR ) ); 
} );
```


Direct browser use
------------------

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
<script src="./lib/SubnetCIDRAdviser.js"></script>
<script type="text/javascript">
  var existingSubnetCIDR = ['10.0.32.0/19'];
  var probabal_subnets = SubnetCIDRAdviser.calculate('10.0.0.0' , '16', existingSubnetCIDR);
  var is_overlap = SubnetCIDRAdviser.isSubnetOverlap(existingSubnetCIDR, '10.0.32.0/20');
  console.log(is_overlap, 'subnetOverlap');
  var ip_range = SubnetCIDRAdviser.getIpRangeForSubnet( '10.0.32.0/20' );
  console.log('IP range for 10.0.32.0/20 is', ip_range);


  var subnetdetails = SubnetCIDRAdviser.getSubnetDetails( '10.0.32.0/20' );
  console.log('Details for 10.0.32.0/20 is', subnetdetails);


  var parentVPC_CIDR = '10.0.0.0/16';
  var cidrToValidate = '';
  var getNextValidCIDR = SubnetCIDRAdviser.getNextValidCIDR( parentVPC_CIDR, existingSubnetCIDR, probabal_subnets, cidrToValidate );
  console.log('getNextValidCIDR is', getNextValidCIDR);
```


API
---

### SubnetCIDRAdviser.calculate( '10.0.0.0', '16', existingSubnetCIDR ) ###


Calculates all possible subnets within the given vpc
... in progress.. more to come... :)

