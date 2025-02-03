<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:variable name="printerIcon">
		<span class="printButton icon icon-tulli-printer"/>
	</xsl:variable>
	<xsl:template match="Introduction">
		<table class="table table-striped table-responsive table-condensed">
			<thead>
				<tr>
					<xsl:choose>
						<xsl:when test="$language='fi'">
							<th>Versio ja päivämäärä</th>
							<th>Muutoksen syy</th>
							<th>Skeema</th>
							<th>Tietosisältö</th>
							<th>Sanoma- liikenneopas</th>
						</xsl:when>
						<xsl:when test="$language='sv'">
							<th>Version och datum</th>
							<th>Orsak till ändring</th>
							<th>Schema</th>
							<th>Datainnehåll</th>
							<th>Guide för meddelandetrafik</th>
						</xsl:when>
						<xsl:when test="$language='en'">
							<th>Version and date</th>
							<th>Reason for amendment</th>
							<th>Schema</th>
							<th>Data requirements</th>
							<th>Guide for message exchange</th>
						</xsl:when>
					</xsl:choose>
				</tr>
			</thead>
			<xsl:for-each select="VersionHistory/Version">
				<xsl:sort select="position()" data-type="number" order="descending"/>
				<tr>
					<td>
						<a href="#" data-toggle="modal">
							<xsl:attribute name="data-target">
								<xsl:value-of select="concat('#Version_',last()-position()+1)"/>
							</xsl:attribute>
							<xsl:value-of select="Number"/>
							<br/>
							<xsl:choose>
								<xsl:when test="string-length(Date)=10">
									<xsl:choose>
										<xsl:when test="$language='en'">
											<xsl:value-of select="concat(substring(Date,9,2), '/', substring(Date,6,2), '/', substring(Date,1,4))"/>
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select="concat(substring(Date,9,2), '.', substring(Date,6,2), '.', substring(Date,1,4))"/>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="Date"/>
								</xsl:otherwise>
							</xsl:choose>
						</a>
					</td>
					<td>
						<xsl:value-of select="Remarks[@lang=($language)]"/>
					</td>
					<td align="center">
						<xsl:if test="Schema=1">•</xsl:if>
					</td>
					<td align="center">
						<xsl:if test="Data=1">•</xsl:if>
					</td>
					<td align="center">
						<xsl:if test="ME=1">•</xsl:if>
					</td>
				</tr>
			</xsl:for-each>
		</table>
		<xsl:choose>
			<xsl:when test="$language='fi' and count(//VersionHistory/Version) > 8">
				<p class="read-more">
					<a href="#" class="button">Lisää</a>
				</p>
			</xsl:when>
			<xsl:when test="$language='sv' and count(//VersionHistory/Version) > 8">
				<p class="read-more">
					<a href="#" class="button">Mera</a>
				</p>
			</xsl:when>
			<xsl:when test="$language='en' and count(//VersionHistory/Version) > 8">
				<p class="read-more">
					<a href="#" class="button">More</a>
				</p>
			</xsl:when>
		</xsl:choose>
		<xsl:for-each select="VersionHistory/Version">
			<div class="modal" tabindex="-1" role="dialog" data-keyboard="false">
				<xsl:attribute name="id">
					<xsl:value-of select="concat('Version_',position())"/>
				</xsl:attribute>
				<div class="modal-dialog modal-lg" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title">
								<xsl:choose>
									<xsl:when test="$language='fi'">
										<xsl:text>Versio </xsl:text>
										<xsl:value-of select="Number"/>
										<xsl:text> </xsl:text>
										<xsl:copy-of select="$printerIcon"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:text>Version </xsl:text>
										<xsl:value-of select="Number"/>
										<xsl:text> </xsl:text>
										<xsl:copy-of select="$printerIcon"/>
									</xsl:otherwise>
								</xsl:choose>
							</h1>
						</div>
						<div class="modal-body">
							<ol>
								<xsl:for-each select="Notes/Note[@lang=($language)]">
									<li>
										<xsl:value-of select="." disable-output-escaping="yes"/>
									</li>
								</xsl:for-each>
							</ol>
						</div>
					</div>
				</div>
			</div>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>