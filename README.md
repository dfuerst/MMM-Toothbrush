# MMM-Toothbrush
hciscanner 

initially modifying Networkscanner to check wether the toothbrush can be detected or not. second step: starting a timer upon detection

MM config:

      {
       			 module: 'MMM-NetworkScannermod',
       			 position: 'bottom_right',
			       header: 'brush',
			       config: {
				     devices: [ 
        			{ macAddress: "e0:e5:cf:fc:4d:8c", name: "brush", icon: "server"},
	
				      ],
          		  // Optional config options
        		}        
    		},
