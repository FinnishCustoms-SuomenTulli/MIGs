<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:param name="messageType"/>
	<xsl:template match="/">
		<table class="table table-responsive">
			<thead>
				<tr>
					<th>
								Tietoelementti/-ryhmä
							</th>
					<th>
								Dataelement/-grupp
							</th>
					<th>
								Data element/group
							</th>
				</tr>
			</thead>
			<xsl:for-each select="descendant::DataGroup | descendant::DataElement">
				<tr>
					<td>
						<xsl:value-of select="Name[@lang='fi']"/>
					</td>
					<td>
						<xsl:value-of select="Name[@lang='sv']"/>
					</td>
					<td>
						<xsl:value-of select="Name[@lang='en']"/>
					</td>
				</tr>
			</xsl:for-each>
		</table>
	</xsl:template>
</xsl:stylesheet>
